"use client";

import { useState, useRef, useEffect } from "react";
import MessageContent from "./MessageContent";
import { exportChatToPDF } from "../utils/exportToPDF";
import ProfileMenu from "./ProfileMenu";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: { id: string; name: string }[]; // Attached files
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  threadId?: string; // OpenAI thread ID for Assistants API
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [deleteConfirmChatId, setDeleteConfirmChatId] = useState<string | null>(null);
  const [showPDFButton, setShowPDFButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  // Load chat history on mount and set sidebar state based on screen size
  useEffect(() => {
    loadChatHistory();
    // Open sidebar by default on desktop (sm breakpoint is 640px)
    if (window.innerWidth >= 640) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // Separate effect to check for redesign completion when switching chats
  useEffect(() => {
    // Only check when switching to a different chat (not during active streaming)
    if (!isLoading && selectedChat && selectedChat.messages.length > 0) {
      const lastAssistantMessage = [...selectedChat.messages]
        .reverse()
        .find(msg => msg.role === 'assistant');

      if (lastAssistantMessage && isRedesignComplete(lastAssistantMessage.content)) {
        setShowPDFButton(true);
      } else {
        setShowPDFButton(false);
      }
    }
  }, [selectedChatId]); // Only run when chat selection changes

  // Load chat history from Supabase
  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch("/api/chat-history");

      if (response.ok) {
        const data = await response.json();
        const loadedChats = data.sessions.map((session: any) => ({
          id: session.id,
          title: session.title,
          threadId: session.thread_id,
          messages: [], // Messages loaded on-demand when chat is selected
        }));
        setChats(loadedChats);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load messages for a specific chat
  const loadChatMessages = async (chatId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await fetch(`/api/chat-history/${chatId}`);

      if (response.ok) {
        const data = await response.json();
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: data.chat.messages.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                  })),
                  threadId: data.chat.threadId,
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Save chat to Supabase (filters out files)
  const saveChatToSupabase = async (chat: Chat) => {
    try {
      // Filter out files from messages before saving
      const cleanMessages = chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chat.id,
          title: chat.title,
          threadId: chat.threadId,
          messages: cleanMessages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to save chat:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  // Delete chat from Supabase
  const confirmDeleteChat = async () => {
    if (!deleteConfirmChatId) return;

    try {
      const response = await fetch(`/api/chat-history/${deleteConfirmChatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== deleteConfirmChatId));
        if (selectedChatId === deleteConfirmChatId) {
          setSelectedChatId(null);
        }
        setDeleteConfirmChatId(null);
      } else {
        console.error("Error deleting chat");
        alert("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };

  const createNewChat = () => {
    // Clear selection first to show empty state
    setSelectedChatId(null);
  };

  const handleConversationStarter = (message: string) => {
    setInput(message);
    // Auto-submit after setting the input
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if user is requesting a PDF download
  const isPDFDownloadRequest = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();

    // Direct PDF requests
    if (lowerMessage.includes('pdf') ||
        lowerMessage.includes('handout') ||
        lowerMessage.includes('printable')) {
      return true;
    }

    // Export/download requests
    const exportPatterns = [
      'download',
      'export',
      'save this',
      'save it',
      'give me a copy',
      'print',
      'can i get',
      'can you give me'
    ];

    return exportPatterns.some(pattern => lowerMessage.includes(pattern));
  };

  // Detect if assistant has completed a redesign
  const isRedesignComplete = (content: string): boolean => {
    if (!content) return false;

    const lowerContent = content.toLowerCase();

    // Check for assignment-related headers/keywords (more flexible)
    const hasAssignmentIndicators =
      content.includes('# ') || // Has markdown headers
      lowerContent.includes('assignment') ||
      lowerContent.includes('project title') ||
      lowerContent.includes('project:') ||
      lowerContent.includes('project idea') ||
      lowerContent.includes('redesign');

    // Check for completion/conclusion markers (more comprehensive)
    const completionMarkers = [
      'here is',
      'here\'s',
      'redesigned',
      'completed',
      'ready for',
      'assignment for',
      'updated assignment',
      'revised assignment',
      'let\'s create',
      'i\'ve created',
      'i\'ve redesigned',
      'i\'ve updated',
      'i\'ve added',
      'i\'ve enhanced',
      'i\'ve revised',
      'i\'ve modified',
      'created a project',
      'created an assignment',
      'updated the assignment',
      'revised the assignment',
      'complete revised version',
      'complete updated version',
      'here\'s the complete'
    ];

    const hasCompletionMarker = completionMarkers.some(marker =>
      lowerContent.includes(marker)
    );

    const isLongEnough = content.length > 500;

    // Must have both: assignment indicators AND completion markers
    // Plus a reasonable length (suggests a full redesign, not just a question)
    return hasAssignmentIndicators && hasCompletionMarker && isLongEnough;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage = input.trim();

    // Check if user is requesting a PDF download
    if (isPDFDownloadRequest(userMessage) && selectedChat && selectedChat.messages.length > 0) {
      // Check if there's actual content to export (at least one assistant message)
      const hasContent = selectedChat.messages.some(msg => msg.role === 'assistant');

      if (hasContent) {
        try {
          // Track PDF download and check limits
          const response = await fetch("/api/download-pdf", {
            method: "POST",
          });

          const data = await response.json();

          if (!response.ok) {
            // Limit reached or error
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === selectedChatId
                  ? {
                      ...chat,
                      messages: [
                        ...chat.messages,
                        { role: "user", content: userMessage },
                        {
                          role: "assistant",
                          content: data.upgradeRequired
                            ? `${data.error}\n\nUpgrade to Educator Plan for unlimited PDF downloads.`
                            : data.error || "Unable to download PDF at this time."
                        }
                      ],
                    }
                  : chat
              )
            );
            setInput("");
            return;
          }

          // Success - proceed with PDF export
          exportChatToPDF(selectedChat);

          // Add a confirmation message
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === selectedChatId
                ? {
                    ...chat,
                    messages: [
                      ...chat.messages,
                      { role: "user", content: userMessage },
                      { role: "assistant", content: "✓ Your assignment has been downloaded as a PDF! Check your Downloads folder." }
                    ],
                  }
                : chat
            )
          );
          setInput("");
          return;
        } catch (error) {
          console.error("PDF download error:", error);
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === selectedChatId
                ? {
                    ...chat,
                    messages: [
                      ...chat.messages,
                      { role: "user", content: userMessage },
                      { role: "assistant", content: "Sorry, there was an error downloading the PDF. Please try again." }
                    ],
                  }
                : chat
            )
          );
          setInput("");
          return;
        }
      }
    }
    const filesToUpload = uploadedFiles;
    setInput("");
    setUploadedFiles([]);

    // Upload files to OpenAI if any
    let fileIds: { id: string; name: string }[] = [];
    if (filesToUpload.length > 0) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload files");
        }

        const uploadData = await uploadResponse.json();
        fileIds = uploadData.files;
      } catch (error: any) {
        console.error("Error uploading files:", error);
        alert("Failed to upload files. Please try again.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // If no chat is selected, create a new one first
    if (!selectedChatId) {
      const newChat: Chat = {
        id: crypto.randomUUID(), // Generate proper UUID
        title: userMessage.slice(0, 30) || "New chat with files",
        messages: [{ role: "user", content: userMessage, files: fileIds.length > 0 ? fileIds : undefined }],
      };
      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
      setIsLoading(true);

      // Call OpenAI Assistants API with progress updates
      try {
        // Add frontend timeout (65 seconds - slightly longer than backend)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 65000);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            threadId: undefined, // New chat, no thread yet
            fileIds: fileIds.map(f => f.id),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to get response");
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let accumulatedContent = "";
        let receivedThreadId = "";

        // Add empty assistant message
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === newChat.id
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { role: "assistant", content: "" },
                  ],
                }
              : chat
          )
        );

        let hasReceivedContent = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);

                if (parsed.threadId) receivedThreadId = parsed.threadId;

                // Handle both delta (new tokens) and content (full text)
                if (parsed.delta || parsed.content) {
                  // Hide loading indicator once we start receiving content
                  if (!hasReceivedContent) {
                    hasReceivedContent = true;
                    setIsLoading(false);
                  }

                  accumulatedContent = parsed.content || accumulatedContent;
                  setChats((prev) =>
                    prev.map((chat) =>
                      chat.id === newChat.id
                        ? {
                            ...chat,
                            threadId: receivedThreadId || chat.threadId,
                            messages: chat.messages.map((msg, idx) =>
                              idx === chat.messages.length - 1
                                ? { ...msg, content: accumulatedContent }
                                : msg
                            ),
                          }
                        : chat
                    )
                  );
                }
                if (parsed.error) throw new Error(parsed.error);
              } catch (e) {
                if (data !== '[DONE]') console.warn('Parse error:', data);
              }
            }
          }
        }

        // Save threadId and prepare chat for saving
        const chatToSave: Chat = {
          id: newChat.id,
          title: newChat.title,
          threadId: receivedThreadId || newChat.threadId,
          messages: [...newChat.messages, { role: "assistant", content: accumulatedContent }]
        };

        if (receivedThreadId) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === newChat.id ? { ...chat, threadId: receivedThreadId } : chat
            )
          );
        }

        // Save chat to Supabase after assistant responds
        if (chatToSave.messages.length > 0) {
          await saveChatToSupabase(chatToSave);
        }
      } catch (error: any) {
        console.error("Error calling API:", error);
        const errorMessage = error.name === 'AbortError'
          ? "Request timed out. This question may be outside my scope. Please ask about assignment redesign, teaching strategies, or educational content."
          : `Error: ${error.message || "Failed to get response. Please try again."}`;

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === newChat.id
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages.slice(0, -1),
                    {
                      role: "assistant",
                      content: errorMessage,
                    },
                  ],
                }
              : chat
          )
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Capture current chat state BEFORE updating
    const currentChat = chats.find((c) => c.id === selectedChatId);
    if (!currentChat) return;

    const currentTitle = currentChat.title === "New chat" ? (userMessage.slice(0, 30) || "New chat with files") : currentChat.title;

    // Add user message and update title
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, { role: "user", content: userMessage, files: fileIds.length > 0 ? fileIds : undefined }],
              title: currentTitle,
            }
          : chat
      )
    );

    setIsLoading(true);
    // Don't hide button here - let detection logic handle it after response

    // Call OpenAI Assistants API with thread ID
    try {

      // Add frontend timeout (65 seconds - slightly longer than backend)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 65000);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          threadId: currentChat?.threadId,
          fileIds: fileIds.map(f => f.id),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let receivedThreadId = "";

      // Add empty assistant message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, { role: "assistant", content: "" }],
              }
            : chat
        )
      );

      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);

              if (parsed.threadId) receivedThreadId = parsed.threadId;

              // Handle both delta (new tokens) and content (full text)
              if (parsed.delta || parsed.content) {
                // Hide loading indicator once we start receiving content
                if (!hasReceivedContent) {
                  hasReceivedContent = true;
                  setIsLoading(false);
                }

                accumulatedContent = parsed.content || accumulatedContent;
                setChats((prev) =>
                  prev.map((chat) =>
                    chat.id === selectedChatId
                      ? {
                          ...chat,
                          threadId: receivedThreadId || chat.threadId,
                          messages: chat.messages.map((msg, idx) =>
                            idx === chat.messages.length - 1
                              ? { ...msg, content: accumulatedContent }
                              : msg
                          ),
                        }
                      : chat
                  )
                );
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch (e) {
              if (data !== '[DONE]') console.warn('Parse error:', data);
            }
          }
        }
      }

      // Save threadId and prepare chat for saving
      const chatToSave: Chat = {
        id: currentChat.id,
        title: currentTitle,
        threadId: receivedThreadId || currentChat.threadId,
        messages: [
          ...currentChat.messages,
          { role: "user", content: userMessage },
          { role: "assistant", content: accumulatedContent }
        ]
      };

      if (receivedThreadId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChatId ? { ...chat, threadId: receivedThreadId } : chat
          )
        );
      }

      // Check if redesign is complete and show/hide PDF button accordingly
      if (accumulatedContent) {
        if (isRedesignComplete(accumulatedContent)) {
          setShowPDFButton(true);
        } else if (accumulatedContent.length > 200) {
          // If it's a substantial response but NOT a redesign, hide the button
          // (Don't hide for very short responses like "Sure!" or "What would you like?")
          setShowPDFButton(false);
        }
      }

      // Save chat to Supabase after assistant responds
      if (chatToSave.messages.length > 0) {
        await saveChatToSupabase(chatToSave);
      }
    } catch (error: any) {
      console.error("Error calling API:", error);
      const errorMessage = error.name === 'AbortError'
        ? "Request timed out. This question may be outside my scope. Please ask about assignment redesign, teaching strategies, or educational content."
        : `Error: ${error.message || "Failed to get response. Please try again."}`;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages.slice(0, -1),
                  {
                    role: "assistant",
                    content: errorMessage,
                  },
                ],
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      {isSidebarOpen && (
        <>
        {/* Mobile overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-10 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
        <div className="w-3/4 sm:w-64 fixed sm:relative z-20 h-full bg-primary-bg border-r border-border-default flex flex-col shadow-xl sm:shadow-none">
        {/* Profile Menu */}
        <div className="p-4 sm:p-3 border-b border-border-default flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <ProfileMenu />
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-2 p-2 rounded-lg hover:bg-secondary-bg sm:hidden flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Home Link */}
        <div className="p-4 sm:p-3 border-b border-border-default">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 rounded-lg hover:bg-secondary-bg transition-colors text-sm text-text-secondary hover:text-foreground"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home</span>
          </a>
        </div>

        {/* New Chat Button */}
        <div className="p-4 sm:p-3">
          <button
            onClick={() => {
              createNewChat();
              // Close sidebar on mobile after creating new chat
              if (window.innerWidth < 640) {
                setIsSidebarOpen(false);
              }
            }}
            className="w-full flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 rounded-lg border border-border-default hover:bg-secondary-bg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">New chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-3 py-2">
          {isLoadingHistory ? (
            <div className="text-center text-text-tertiary py-4 text-sm">
              Loading chats...
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-text-tertiary py-4 text-sm">
              No chats yet. Start a new conversation!
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative flex items-center gap-2 px-4 sm:px-3 py-3 sm:py-2.5 rounded-lg mb-1 text-sm transition-colors ${
                  selectedChatId === chat.id
                    ? "bg-secondary-bg"
                    : "hover:bg-secondary-bg/50"
                }`}
              >
                <button
                  onClick={async () => {
                    setSelectedChatId(chat.id);
                    // Load messages if not already loaded
                    if (chat.messages.length === 0) {
                      await loadChatMessages(chat.id);
                    }
                    // Close sidebar on mobile after selecting chat
                    if (window.innerWidth < 640) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className="flex-1 text-left truncate"
                >
                  {chat.title}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmChatId(chat.id);
                  }}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 sm:p-1.5 hover:bg-tertiary-bg rounded transition-opacity"
                  title="Delete chat"
                >
                  <svg className="w-4 h-4 text-text-secondary hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        </div>
        </>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Toggle Sidebar Button - Compact ChatGPT-style */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-3 left-3 z-10 p-1.5 rounded-md hover:bg-secondary-bg transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {!selectedChat || selectedChat.messages.length === 0 ? (
          // Empty State - Show when no chat is selected or selected chat has no messages
          <div className="flex-1 flex items-start sm:items-center justify-center overflow-y-auto px-4 pt-12 sm:pt-0">
            <div className="text-center max-w-2xl py-4 sm:py-8">
              <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 bg-white rounded-2xl p-2.5 sm:p-4">
                <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">TaskFixer AI</h1>
              <p className="text-xs text-text-tertiary mb-2">By Jamiylah Jones</p>
              <p className="text-xs sm:text-base text-text-secondary leading-relaxed mb-4 sm:mb-8">
                TaskFixer AI helps teachers redesign assignments, assessments, and projects into higher-order, cheat-resistant learning tasks.
              </p>

              {/* Conversation Starters */}
              <div className="grid grid-cols-1 gap-2 sm:gap-3 max-w-xl mx-auto">
                <button
                  onClick={() => handleConversationStarter("Can you help me redesign this assignment to make it cheat-proof and more rigorous?")}
                  className="text-left p-3 sm:p-4 bg-secondary-bg hover:bg-tertiary-bg rounded-xl transition-colors border border-border-default hover:border-border-hover"
                >
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Redesign my assignment to be cheat-proof and more rigorous
                  </p>
                </button>
                <button
                  onClick={() => handleConversationStarter("Can you help me create a new project idea that includes responsible AI use?")}
                  className="text-left p-3 sm:p-4 bg-secondary-bg hover:bg-tertiary-bg rounded-xl transition-colors border border-border-default hover:border-border-hover"
                >
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Create a project with responsible AI use
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : isLoadingMessages ? (
          // Loading messages state
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-text-secondary">Loading messages...</p>
            </div>
          </div>
        ) : (
          // Messages
          <div className="flex-1 overflow-y-auto relative">
            {/* Background Watermark */}
            <div
              className="fixed top-1/2 left-1/2 pointer-events-none"
              style={{
                width: '500px',
                height: '500px',
                backgroundImage: 'url(/logo.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.06,
                filter: 'blur(1px)',
                zIndex: 1,
                transform: 'translate(-35%, -50%)'
              }}
            />
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
              {selectedChat.messages.map((message, index) => {
                // Skip rendering assistant messages with no content
                if (message.role === "assistant" && !message.content.trim()) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className={`mb-6 ${
                      message.role === "user" ? "flex justify-end" : ""
                    }`}
                  >
                    {message.role === "user" ? (
                      // User message with bubble
                      <div className="max-w-[85%] sm:max-w-[75%]">
                        {/* Files */}
                        {message.files && message.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 justify-end">
                            {message.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg rounded-lg text-xs"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-text-secondary">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="bg-brand-purple text-white px-4 py-3 rounded-2xl text-[15px] leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      // AI message without bubble
                      <div className="max-w-[95%]">
                        <div className="text-[15px] leading-relaxed">
                          <MessageContent content={message.content} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* PDF Download Button - Shows when redesign is complete */}
              {showPDFButton && selectedChat && (
                <div className="mb-8 flex justify-center">
                  <button
                    onClick={async () => {
                      try {
                        // Track PDF download and check limits
                        const response = await fetch("/api/download-pdf", {
                          method: "POST",
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          alert(data.error || "Failed to download PDF");
                          return;
                        }

                        // Generate and download PDF
                        await exportChatToPDF(selectedChat);

                        // Hide button after successful download
                        setShowPDFButton(false);

                        // Add confirmation message
                        setChats((prev) =>
                          prev.map((chat) =>
                            chat.id === selectedChatId
                              ? {
                                  ...chat,
                                  messages: [
                                    ...chat.messages,
                                    {
                                      role: "assistant",
                                      content: "✓ Your assignment has been downloaded as a PDF! Check your Downloads folder.",
                                    },
                                  ],
                                }
                              : chat
                          )
                        );
                      } catch (error) {
                        console.error("Error downloading PDF:", error);
                        alert("Failed to download PDF. Please try again.");
                      }
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Download PDF</span>
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="mb-6">
                  <div className="max-w-[95%]">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area - Always visible - extra bottom padding on mobile for iOS safe area */}
        <div className="border-t border-border-default p-3 sm:p-4 pb-8 sm:pb-4" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
          <div className="max-w-3xl mx-auto">
            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary-bg rounded-lg text-xs sm:text-sm border border-border-default"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-text-secondary max-w-[120px] sm:max-w-[200px] truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-1 text-text-secondary hover:text-foreground transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Message TaskFixerAI..."
                  className="w-full bg-secondary-bg rounded-xl px-4 py-3 pl-12 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-border-hover placeholder-text-tertiary text-foreground text-base"
                  rows={1}
                  style={{
                    minHeight: "48px",
                    maxHeight: "200px",
                    fontSize: "16px",
                  }}
                  disabled={isLoading || isUploading}
                />
                {/* File Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="absolute left-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-tertiary-bg disabled:opacity-50 transition-colors"
                  title="Attach files (PDF, DOC, TXT)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.csv,.json"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="submit"
                  disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading || isUploading}
                  className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark disabled:opacity-50 disabled:hover:bg-brand-purple transition-colors"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmChatId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-bg rounded-xl p-6 max-w-md w-full mx-4 border border-border-default">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Delete Chat</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Are you sure you want to delete this chat? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmChatId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-secondary-bg hover:bg-tertiary-bg text-foreground font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
