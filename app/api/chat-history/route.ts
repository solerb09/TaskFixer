import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/chat-history - Load all user's chat sessions
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all chat sessions for the user, ordered by most recent
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching chat sessions:", error);
      return NextResponse.json(
        { error: "Failed to load chat history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (error: any) {
    console.error("Chat history error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load chat history" },
      { status: 500 }
    );
  }
}

// POST /api/chat-history - Save or update a chat session
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chatId, title, threadId, messages } = await req.json();

    if (!chatId || !title || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Filter out any file attachments from messages
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Check if chat session already exists
    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", chatId)
      .eq("user_id", user.id)
      .single();

    if (existingSession) {
      // Update existing session
      const { error: updateError } = await supabase
        .from("chat_sessions")
        .update({
          title,
          thread_id: threadId,
          updated_at: new Date().toISOString()
        })
        .eq("id", chatId)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating chat session:", updateError);
        return NextResponse.json(
          { error: "Failed to update chat" },
          { status: 500 }
        );
      }

      // Delete existing messages and insert new ones
      await supabase
        .from("chat_messages")
        .delete()
        .eq("chat_session_id", chatId);

      // Insert all messages
      const messagesToInsert = cleanMessages.map(msg => ({
        chat_session_id: chatId,
        role: msg.role,
        content: msg.content
      }));

      const { error: messagesError } = await supabase
        .from("chat_messages")
        .insert(messagesToInsert);

      if (messagesError) {
        console.error("Error saving messages:", messagesError);
        return NextResponse.json(
          { error: "Failed to save messages" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        chatId,
        message: "Chat updated successfully"
      });
    } else {
      // Create new session
      const { error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          id: chatId,
          user_id: user.id,
          title,
          thread_id: threadId
        });

      if (sessionError) {
        console.error("Error creating chat session:", sessionError);
        return NextResponse.json(
          { error: "Failed to create chat" },
          { status: 500 }
        );
      }

      // Insert messages
      const messagesToInsert = cleanMessages.map(msg => ({
        chat_session_id: chatId,
        role: msg.role,
        content: msg.content
      }));

      const { error: messagesError } = await supabase
        .from("chat_messages")
        .insert(messagesToInsert);

      if (messagesError) {
        console.error("Error saving messages:", messagesError);
        return NextResponse.json(
          { error: "Failed to save messages" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        chatId,
        message: "Chat created successfully"
      });
    }
  } catch (error: any) {
    console.error("Save chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save chat" },
      { status: 500 }
    );
  }
}
