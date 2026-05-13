"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  PentagramIcon,
  ShootingStarIcon,
  User as UserIcon,
} from "@phosphor-icons/react";
import useChat from "@/features/chats/useChat";
import useAuth from "@/features/auth/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Spline from "@splinetool/react-spline";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function ChatArea() {
  const { currentChat, isChatLoading, sendMessage, isStreaming } = useChat();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Scroll helper: instant during streaming, smooth otherwise
  const scrollToBottom = useCallback((instant = false) => {
    if (instant && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    } else if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Get the latest AI message content to track streaming progress
  const lastMessage = currentChat?.messages?.[currentChat.messages.length - 1];
  const streamingContent =
    isStreaming && lastMessage?.role === "ai" ? lastMessage.content : null;

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
        <PentagramIcon
          weight="fill"
          className="text-primary w-8 h-8 animate-spin"
        />
      </div>
    );
  }

  // Empty State (New Chat)
  if (!currentChat || currentChat.messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8 pt-[calc(max(env(safe-area-inset-top),20px))]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-12 lg:gap-20 mt-4"
        >
          {/* Text Content */}
          <motion.div
            variants={itemVariants}
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 w-full"
          >
            <motion.h1
              variants={itemVariants}
              className="mb-4 flex flex-col items-center md:items-start text-center md:text-left"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-light text-foreground/70 mb-2">
                Welcome back,
              </span>
              <span className="text-6xl sm:text-7xl md:text-[5rem] lg:text-[5.5rem] tracking-tight font-medium bg-linear-to-r from-primary via-fuchsia-500 to-secondary bg-clip-text text-transparent drop-shadow-md pb-2 leading-[1.1]">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted font-light max-w-lg"
            >
              How can I assist you today? Let's build, learn, or explore
              something new together.
            </motion.p>
          </motion.div>

          {/* 3D Model Container */}
          <motion.div
            variants={itemVariants}
            className="flex-1 w-full h-[350px] sm:h-[400px] md:h-[500px] flex items-center justify-center relative"
          >
            <div className="w-full h-full relative z-10">
              <Spline scene="https://prod.spline.design/xs2Dml6OGh6O27TY/scene.splinecode" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Active Chat State
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Chat Title Header */}
      <div className="shrink-0 py-4 pt-[calc(max(env(safe-area-inset-top),16px))] pl-18 pr-4 md:py-5 md:pl-20 md:pr-8 border-b border-card-border/50 bg-background/80 backdrop-blur-md z-10 flex items-center justify-start shadow-sm transition-all">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate max-w-[85%] md:max-w-2xl">
          {currentChat.title || "Active Chat"}
        </h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
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
                    <ShootingStarIcon
                      weight="fill"
                      className="text-white w-4 h-4"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[75%] text-[16px] leading-relaxed ${
                    isUser
                      ? "p-4 bg-primary text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm shadow-sm"
                      : "text-foreground pt-1"
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap flex flex-col gap-2">
                      {msg.content.startsWith("[ATTACHED_PDF: ") ? (
                        <>
                          <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-2 rounded-lg text-sm font-medium shadow-sm border border-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159l93.66-94.31a8,8,0,0,1,11.34,11.29L82.34,170.31a8,8,0,1,0,11.3,11.34l99.33-100.67a24,24,0,0,0-34-33.91L59.66,147.74a40,40,0,1,0,56.6,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path></svg>
                            <span className="truncate max-w-[200px] md:max-w-[300px]">
                              {msg.content.match(/\[ATTACHED_PDF:\s*(.*?)\]/)?.[1]}
                            </span>
                          </div>
                          <div>{msg.content.replace(/\[ATTACHED_PDF:\s*(.*?)\]\n\n/, '')}</div>
                        </>
                      ) : (
                        msg.content
                      )}
                    </div>
                  ) : (
                    <div className="markdown-body">
                      {/* Show typing dots while waiting for first chunk */}
                      {isStreaming &&
                      index === currentChat.messages.length - 1 &&
                      !msg.content ? (
                        <div className="flex items-center gap-1.5 py-2">
                          <span
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      ) : (
                        <>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || "",
                                );
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
                                  <code
                                    {...props}
                                    className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-primary border border-zinc-200 dark:border-zinc-700"
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              p({ children }) {
                                return (
                                  <p className="mb-4 last:mb-0 leading-loose text-foreground/90">
                                    {children}
                                  </p>
                                );
                              },
                              ul({ children }) {
                                return (
                                  <ul className="list-disc pl-5 mb-4 space-y-2 text-foreground/90">
                                    {children}
                                  </ul>
                                );
                              },
                              ol({ children }) {
                                return (
                                  <ol className="list-decimal pl-5 mb-4 space-y-2 text-foreground/90">
                                    {children}
                                  </ol>
                                );
                              },
                              h1({ children }) {
                                return (
                                  <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground tracking-tight">
                                    {children}
                                  </h1>
                                );
                              },
                              h2({ children }) {
                                return (
                                  <h2 className="text-xl font-bold mb-3 mt-5 text-foreground tracking-tight">
                                    {children}
                                  </h2>
                                );
                              },
                              h3({ children }) {
                                return (
                                  <h3 className="text-lg font-semibold mb-3 mt-4 text-foreground tracking-tight">
                                    {children}
                                  </h3>
                                );
                              },
                              strong({ children }) {
                                return (
                                  <strong className="font-semibold text-foreground">
                                    {children}
                                  </strong>
                                );
                              },
                              a({ children, href }) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-hover underline underline-offset-4 decoration-primary/30 transition-colors"
                                  >
                                    {children}
                                  </a>
                                );
                              },
                              table({ children }) {
                                return (
                                  <div className="overflow-x-auto my-4">
                                    <table className="min-w-full text-sm text-left">
                                      {children}
                                    </table>
                                  </div>
                                );
                              },
                              thead({ children }) {
                                return (
                                  <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800/50 text-muted">
                                    {children}
                                  </thead>
                                );
                              },
                              th({ children }) {
                                return (
                                  <th className="px-4 py-3 font-medium border-b border-card-border">
                                    {children}
                                  </th>
                                );
                              },
                              td({ children }) {
                                return (
                                  <td className="px-4 py-3 border-b border-card-border/50">
                                    {children}
                                  </td>
                                );
                              },
                              blockquote({ children }) {
                                return (
                                  <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-r-lg text-muted italic">
                                    {children}
                                  </blockquote>
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                          {/* Blinking cursor while AI is still streaming */}
                          {isStreaming &&
                            index === currentChat.messages.length - 1 && (
                              <span className="inline-block w-0.75 h-[1.1em] bg-primary/70 rounded-full ml-0.5 align-middle animate-pulse" />
                            )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1 overflow-hidden shadow-sm">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
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
    </div>
  );
}
