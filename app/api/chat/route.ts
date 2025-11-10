import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, incrementFileCount, addWordCount, countWords, getFeatureAccess } from "@/lib/usage";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

// Simple web search function using DuckDuckGo (no API key needed)
async function performWebSearch(query: string, numResults: number = 5) {
  try {
    // Using DuckDuckGo Instant Answer API (free, no auth required)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    const data = await response.json();

    // Format results
    const results = [];

    if (data.Abstract) {
      results.push({
        title: data.Heading || 'Overview',
        snippet: data.Abstract,
        url: data.AbstractURL
      });
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, numResults - 1).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0],
            snippet: topic.Text,
            url: topic.FirstURL
          });
        }
      });
    }

    return {
      query,
      results: results.slice(0, numResults),
      total: results.length
    };
  } catch (error) {
    console.error('Web search error:', error);
    return {
      query,
      results: [],
      error: 'Failed to perform web search'
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // Check usage limits
    const usageCheck = await checkUsageLimit(user.id);
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

    // Get user profile for feature access
    const { data: profile } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

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
            try {
              controller.close();
            } catch (error) {
              console.error('Error closing controller:', error);
            }
          }
        };

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

          stream.on('toolCallCreated', (toolCall: any) => {
            if (toolCall.type === 'function') {
              safeEnqueue(`data: ${JSON.stringify({ status: 'searching' })}\n\n`);
            }
          });

          // Handle tool call requirements
          stream.on('requiresAction', async (event: any) => {
            try {
              const toolCalls = event.required_action?.submit_tool_outputs?.tool_calls || [];
              const toolOutputs = [];

              for (const toolCall of toolCalls) {
                if (toolCall.function.name === 'web_search') {
                  const args = JSON.parse(toolCall.function.arguments);
                  const searchResults = await performWebSearch(
                    args.query,
                    args.num_results || 5
                  );

                  toolOutputs.push({
                    tool_call_id: toolCall.id,
                    output: JSON.stringify(searchResults)
                  });
                }
              }

              // Submit tool outputs and continue streaming
              if (toolOutputs.length > 0) {
                await stream.submitToolOutputs(toolOutputs);
              }
            } catch (error) {
              console.error('Error handling tool calls:', error);
            }
          });

          stream.on('end', async () => {
            // Track usage after successful completion
            try {
              if (fullTextContent) {
                // Track word count for free trial limits (800 words)
                const wordCount = countWords(fullTextContent);
                await addWordCount(user.id, wordCount);

                // Increment file count if files were uploaded (only on first message with files)
                if (fileIds && fileIds.length > 0) {
                  await incrementFileCount(user.id, fileIds.length);
                }

                // Note: PDF redesign count is NOT incremented here
                // It should only be incremented when user actually downloads a PDF
              }
            } catch (trackingError) {
              console.error('Error tracking usage:', trackingError);
              // Don't fail the request if tracking fails
            }

            safeEnqueue(`data: [DONE]\n\n`);
            safeClose();
          });

          stream.on('error', (error: any) => {
            console.error('Stream error:', error);
            safeEnqueue(`data: ${JSON.stringify({ error: error.message || 'Streaming failed' })}\n\n`);
            safeClose();
          });

          // Wait for stream to complete (using done() instead of finalPromise())
          await stream.done();

        } catch (error: any) {
          console.error("Run error:", error);
          safeEnqueue(`data: ${JSON.stringify({ error: error.message || 'Processing failed' })}\n\n`);
          safeClose();
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
