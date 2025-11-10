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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
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
        id: Date.now().toString(),
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

        // Save threadId
        if (receivedThreadId) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === newChat.id ? { ...chat, threadId: receivedThreadId } : chat
            )
          );
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

    // Add user message and update title
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, { role: "user", content: userMessage, files: fileIds.length > 0 ? fileIds : undefined }],
              title: chat.title === "New chat" ? (userMessage.slice(0, 30) || "New chat with files") : chat.title,
            }
          : chat
      )
    );

    setIsLoading(true);

    // Call OpenAI Assistants API with thread ID
    try {
      const currentChat = chats.find((c) => c.id === selectedChatId);

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

      if (receivedThreadId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChatId ? { ...chat, threadId: receivedThreadId } : chat
          )
        );
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
    <div className="flex h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-[#171717] border-r border-[#2a2a2a] flex flex-col">
        {/* Profile Menu */}
        <div className="p-3 border-b border-[#2a2a2a]">
          <ProfileMenu />
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">New chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm truncate transition-colors ${
                selectedChatId === chat.id
                  ? "bg-[#2a2a2a]"
                  : "hover:bg-[#212121]"
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Toggle Sidebar Button - Compact ChatGPT-style */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-3 left-3 z-10 p-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {!selectedChat || selectedChat.messages.length === 0 ? (
          // Empty State - Show for new chats with no messages
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <div className="text-center max-w-2xl px-4 py-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl p-4">
                <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl font-semibold mb-4">TaskFixer AI</h1>
              <p className="text-sm text-gray-500 mb-2">By Jamiylah Jones</p>
              <p className="text-gray-300 leading-relaxed mb-8">
                TaskFixer AI helps teachers redesign assignments, assessments, and projects into higher-order, cheat-resistant learning tasks. Teachers can use it to create new tasks, improve existing ones, or analyze student submissions. Each redesign includes reflections, rubrics, and tips for ethical AI use.
              </p>

              {/* Conversation Starters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                <button
                  onClick={() => handleConversationStarter("Can you help me redesign this assignment to make it cheat-proof and more rigorous?")}
                  className="text-left p-4 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl transition-colors border border-[#404040] hover:border-[#4a4a4a]"
                >
                  <p className="text-sm text-gray-300">
                    Can you help me redesign this assignment to make it cheat-proof and more rigorous?
                  </p>
                </button>
                <button
                  onClick={() => handleConversationStarter("Can you help me create a new project idea that includes responsible AI use?")}
                  className="text-left p-4 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl transition-colors border border-[#404040] hover:border-[#4a4a4a]"
                >
                  <p className="text-sm text-gray-300">
                    Can you help me create a new project idea that includes responsible AI use?
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Messages
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-8">
              {selectedChat.messages.map((message, index) => {
                // Skip rendering assistant messages with no content
                if (message.role === "assistant" && !message.content.trim()) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className={`mb-8 ${
                      message.role === "user" ? "flex justify-end" : ""
                    }`}
                  >
                    <div className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                        {message.role === "user" ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4">
                            <img src="/logo.png" alt="AI" className="w-full h-full object-cover rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium text-gray-400">
                          {message.role === "user" ? "You" : "TaskFixerAI"}
                        </div>
                        {/* Files */}
                        {message.files && message.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {message.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] rounded-lg text-xs"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-300">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-[15px] leading-relaxed">
                          {message.role === "assistant" ? (
                            <MessageContent content={message.content} />
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="mb-8">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4">
                        <img src="/logo.png" alt="AI" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-gray-400">TaskFixerAI</div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area - Always visible */}
        <div className="border-t border-[#2a2a2a] p-4">
          <div className="max-w-3xl mx-auto">
            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] rounded-lg text-sm border border-[#404040]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300 max-w-[200px] truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-1 text-gray-400 hover:text-white transition-colors"
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
                  className="w-full bg-[#2a2a2a] rounded-xl px-4 py-3 pl-12 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-[#404040] placeholder-gray-500"
                  rows={1}
                  style={{
                    minHeight: "52px",
                    maxHeight: "200px",
                  }}
                  disabled={isLoading || isUploading}
                />
                {/* File Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="absolute left-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#333333] disabled:opacity-50 transition-colors"
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
                  className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
    </div>
  );
}
