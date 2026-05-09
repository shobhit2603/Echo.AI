"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Brain, Compass, PencilCircle, Sparkle, User as UserIcon } from "@phosphor-icons/react";
import useChat from "@/features/chats/useChat";
import useAuth from "@/features/auth/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function ChatArea() {
  const { currentChat, isChatLoading, sendMessage, isStreaming } = useChat();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Scroll helper: instant during streaming, smooth otherwise
  const scrollToBottom = useCallback((instant = false) => {
    if (instant && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    } else if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Get the latest AI message content to track streaming progress
  const lastMessage = currentChat?.messages?.[currentChat.messages.length - 1];
  const streamingContent = isStreaming && lastMessage?.role === "ai" ? lastMessage.content : null;

  // Auto-scroll during streaming — fires on every chunk
  useEffect(() => {
    if (isStreaming && streamingContent !== null) {
      scrollToBottom(true);
    }
  }, [streamingContent, isStreaming, scrollToBottom]);

  // Smooth scroll on new messages (non-streaming)
  useEffect(() => {
    if (!isStreaming) {
      scrollToBottom(false);
    }
  }, [currentChat?.messages?.length, isStreaming, scrollToBottom]);

  const handleSuggestionClick = (text) => {
    sendMessage(text, currentChat?._id);
  };

  if (isChatLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Sparkle weight="fill" className="text-primary w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Empty State (New Chat)
  if (!currentChat || currentChat.messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl flex flex-col items-center text-center mt-12 mb-20"
        >
          <motion.div variants={itemVariants} className="p-4 bg-primary/10 rounded-3xl mb-6">
            <Sparkle weight="fill" className="text-primary h-12 w-12" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl tracking-tight font-medium text-foreground mb-4">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted font-light max-w-lg mb-12">
            How can I assist you today? Let's build, learn, or explore something new.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestionClick("Explain quantum computing in simple terms.")}
              className="flex flex-col items-start text-left p-6 rounded-3xl bg-card border border-card-border hover:border-primary/30 transition-colors shadow-sm"
            >
              <Brain weight="duotone" className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-medium text-foreground mb-1">Learn</h3>
              <p className="text-xs text-muted font-light">Explain complex topics simply.</p>
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestionClick("Draft an email to my team about the upcoming product launch.")}
              className="flex flex-col items-start text-left p-6 rounded-3xl bg-card border border-card-border hover:border-secondary/30 transition-colors shadow-sm"
            >
              <PencilCircle weight="duotone" className="text-secondary w-8 h-8 mb-4" />
              <h3 className="font-medium text-foreground mb-1">Create</h3>
              <p className="text-xs text-muted font-light">Draft emails, essays, or code.</p>
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestionClick("What are some hidden gem travel destinations in Japan?")}
              className="flex flex-col items-start text-left p-6 rounded-3xl bg-card border border-card-border hover:border-zinc-400 transition-colors shadow-sm"
            >
              <Compass weight="duotone" className="text-zinc-400 w-8 h-8 mb-4" />
              <h3 className="font-medium text-foreground mb-1">Explore</h3>
              <p className="text-xs text-muted font-light">Discover new ideas and places.</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Chat State
  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
      <div className="max-w-4xl mx-auto space-y-6 pb-4">
        {currentChat.messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Sparkle weight="fill" className="text-white w-4 h-4" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 text-[16px] leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-primary text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm"
                    : "bg-card text-foreground border border-card-border rounded-r-2xl rounded-tl-2xl rounded-bl-sm"
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="markdown-body">
                    {/* Show typing dots while waiting for first chunk */}
                    {isStreaming && index === currentChat.messages.length - 1 && !msg.content ? (
                      <div className="flex items-center gap-1.5 py-2">
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : (
                      <>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || "");
                              return !inline && match ? (
                                <div className="rounded-xl overflow-hidden my-4 border border-zinc-700 shadow-md">
                                  <div className="bg-zinc-800/80 px-4 py-2 flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-700">
                                    <span>{match[1]}</span>
                                  </div>
                                  <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="m-0! bg-[#1e1e1e]! p-4! text-sm! scrollbar-thin scrollbar-thumb-zinc-600"
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code {...props} className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-primary border border-zinc-200 dark:border-zinc-700">
                                  {children}
                                </code>
                              );
                            },
                            p({ children }) {
                              return <p className="mb-4 last:mb-0 leading-loose text-foreground/90">{children}</p>;
                            },
                            ul({ children }) {
                              return <ul className="list-disc pl-5 mb-4 space-y-2 text-foreground/90">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal pl-5 mb-4 space-y-2 text-foreground/90">{children}</ol>;
                            },
                            h1({ children }) {
                              return <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground tracking-tight">{children}</h1>;
                            },
                            h2({ children }) {
                              return <h2 className="text-xl font-bold mb-3 mt-5 text-foreground tracking-tight">{children}</h2>;
                            },
                            h3({ children }) {
                              return <h3 className="text-lg font-semibold mb-3 mt-4 text-foreground tracking-tight">{children}</h3>;
                            },
                            strong({ children }) {
                              return <strong className="font-semibold text-foreground">{children}</strong>;
                            },
                            a({ children, href }) {
                              return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover underline underline-offset-4 decoration-primary/30 transition-colors">{children}</a>;
                            },
                            table({ children }) {
                              return <div className="overflow-x-auto my-4"><table className="min-w-full text-sm text-left">{children}</table></div>;
                            },
                            thead({ children }) {
                              return <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800/50 text-muted">{children}</thead>;
                            },
                            th({ children }) {
                              return <th className="px-4 py-3 font-medium border-b border-card-border">{children}</th>;
                            },
                            td({ children }) {
                              return <td className="px-4 py-3 border-b border-card-border/50">{children}</td>;
                            },
                            blockquote({ children }) {
                              return <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-r-lg text-muted italic">{children}</blockquote>;
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        {/* Blinking cursor while AI is still streaming */}
                        {isStreaming && index === currentChat.messages.length - 1 && (
                          <span className="inline-block w-[3px] h-[1.1em] bg-primary/70 rounded-full ml-0.5 align-middle animate-pulse" />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1 overflow-hidden shadow-sm">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon weight="fill" className="text-muted w-4 h-4" />
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
