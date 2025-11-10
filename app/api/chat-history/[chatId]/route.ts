import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/chat-history/[chatId] - Load a specific chat with all messages
export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
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

    const { chatId } = params;

    // Fetch the chat session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", chatId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    // Fetch all messages for this chat
    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_session_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      chat: {
        id: session.id,
        title: session.title,
        threadId: session.thread_id,
        messages: messages || [],
        created_at: session.created_at,
        updated_at: session.updated_at
      }
    });
  } catch (error: any) {
    console.error("Load chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load chat" },
      { status: 500 }
    );
  }
}

// DELETE /api/chat-history/[chatId] - Delete a chat (hard delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
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

    const { chatId } = params;

    // Delete the chat session (messages will be cascade deleted)
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", chatId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting chat:", error);
      return NextResponse.json(
        { error: "Failed to delete chat" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete chat" },
      { status: 500 }
    );
  }
}
