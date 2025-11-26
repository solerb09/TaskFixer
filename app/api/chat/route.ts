import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, incrementFileCount, addWordCount, countWords, getFeatureAccess } from "@/lib/usage";
import { Database } from "@/types/database";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export async function POST(req: NextRequest) {
  try {
    // Parse request body first
    const { message, threadId, fileIds } = await req.json();

    if ((!message || typeof message !== 'string') && (!fileIds || fileIds.length === 0)) {
      return new Response(
        JSON.stringify({ error: "Message string or files are required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!ASSISTANT_ID) {
      return new Response(
        JSON.stringify({ error: "Assistant not configured. Please set OPENAI_ASSISTANT_ID in environment variables." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // OPTIMIZATION: Parallelize all database queries
    const supabase = await createClient();
    const [
      { data: { user } },
      // We'll check usage and get profile after auth succeeds
    ] = await Promise.all([
      supabase.auth.getUser(),
    ]);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // OPTIMIZATION: Parallelize usage check and profile fetch
    const [usageCheck, { data: profile }] = await Promise.all([
      checkUsageLimit(user.id),
      supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single<{ subscription_tier: Database['public']['Tables']['users']['Row']['subscription_tier'] }>()
    ]);

    if (!usageCheck.canUse) {
      return new Response(
        JSON.stringify({
          error: usageCheck.reason,
          usage: usageCheck.usage,
          limits: usageCheck.limits,
          upgradeRequired: true,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const features = profile ? getFeatureAccess(profile.subscription_tier) : getFeatureAccess('free_trial');

    // Step 1: Create or use existing thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Step 2: Add user message to thread with optional file attachments
    const messagePayload: any = {
      role: "user",
      content: message || "Please analyze the attached files.",
    };

    // Add file attachments if provided
    if (fileIds && fileIds.length > 0) {
      messagePayload.attachments = fileIds.map((fileId: string) => ({
        file_id: fileId,
        tools: [{ type: "file_search" }],
      }));
    }

    await openai.beta.threads.messages.create(currentThreadId, messagePayload);

    // Step 3: Create streaming run for real-time token-by-token responses
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullTextContent = '';
        let isControllerClosed = false;
        let timeoutId: NodeJS.Timeout | null = null;

        const safeEnqueue = (data: string) => {
          if (!isControllerClosed) {
            try {
              controller.enqueue(encoder.encode(data));
            } catch (error) {
              console.error('Error enqueueing data:', error);
            }
          }
        };

        const safeClose = () => {
          if (!isControllerClosed) {
            isControllerClosed = true;
            // Always clear timeout when closing
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            try {
              controller.close();
            } catch (error) {
              console.error('Error closing controller:', error);
            }
          }
        };

        // Timeout protection (60 seconds)
        timeoutId = setTimeout(() => {
          if (!isControllerClosed) {
            console.error('Stream timeout after 60 seconds');
            safeEnqueue(`data: ${JSON.stringify({ error: 'Request timed out. Please try again or rephrase your question.' })}\n\n`);
            safeClose();
          }
        }, 60000);

        try {
          // Send threadId first
          safeEnqueue(`data: ${JSON.stringify({ threadId: currentThreadId })}\n\n`);

          // Create a streaming run
          const stream = openai.beta.threads.runs.stream(currentThreadId, {
            assistant_id: ASSISTANT_ID
          });

          // Handle stream events
          stream.on('textCreated', () => {
            // Text generation started
            safeEnqueue(`data: ${JSON.stringify({ status: 'streaming' })}\n\n`);
          });

          stream.on('textDelta', (textDelta: any, snapshot: any) => {
            // Send each token as it arrives
            const deltaText = textDelta.value || '';
            if (deltaText) {
              fullTextContent += deltaText;
              safeEnqueue(`data: ${JSON.stringify({ delta: deltaText, content: fullTextContent })}\n\n`);
            }
          });

          stream.on('end', async () => {
            // OPTIMIZATION: Track usage in background (don't await)
            // This allows the stream to close immediately without waiting for DB writes
            if (fullTextContent) {
              // Fire and forget - track asynchronously
              (async () => {
                try {
                  // Track word count for free trial limits (800 words)
                  const wordCount = countWords(fullTextContent);
                  await addWordCount(user.id, wordCount);

                  // Increment file count if files were uploaded (only on first message with files)
                  if (fileIds && fileIds.length > 0) {
                    await incrementFileCount(user.id, fileIds.length);
                  }

                  // Note: PDF redesign count is NOT incremented here
                  // It should only be incremented when user actually downloads a PDF
                } catch (trackingError) {
                  console.error('Error tracking usage:', trackingError);
                  // Silent fail - don't impact user experience
                }
              })();
            }

            safeEnqueue(`data: [DONE]\n\n`);
            safeClose(); // This will clear the timeout
          });

          stream.on('error', (error: any) => {
            console.error('Stream error:', error);
            safeEnqueue(`data: ${JSON.stringify({ error: error.message || 'Streaming failed' })}\n\n`);
            safeClose(); // This will clear the timeout
          });

          // Wait for stream to complete (using done() instead of finalPromise())
          await stream.done();

        } catch (error: any) {
          console.error("Run error:", error);
          safeEnqueue(`data: ${JSON.stringify({ error: error.message || 'Processing failed' })}\n\n`);
          safeClose(); // This will clear the timeout
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    // Handle specific OpenAI errors
    let errorMessage = error.message || "Failed to get response from assistant";
    let status = 500;

    if (error?.status === 401) {
      errorMessage = "Invalid API key";
      status = 401;
    } else if (error?.status === 429) {
      errorMessage = "Rate limit exceeded";
      status = 429;
    } else if (error?.status === 404) {
      errorMessage = "Assistant or thread not found";
      status = 404;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
