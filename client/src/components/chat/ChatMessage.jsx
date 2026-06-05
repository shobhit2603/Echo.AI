import React, { useState } from 'react';
import { motion } from "motion/react";
import { ShootingStarIcon, UserIcon, SpeakerHighIcon, StopCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import MarkdownRenderer from "./MarkdownRenderer";
import { speakText, stopSpeech } from "../../utils/SpeechUtils";

export default function ChatMessage({ msg, user, isStreaming, isLastMessage }) {
  const isUser = msg.role === "user";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(msg.content, () => setIsSpeaking(false));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <ShootingStarIcon weight="fill" className="text-white w-4 h-4" />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159l93.66-94.31a8,8,0,0,1,11.34,11.29L82.34,170.31a8,8,0,1,0,11.3,11.34l99.33-100.67a24,24,0,0,0-34-33.91L59.66,147.74a40,40,0,1,0,56.6,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path>
                  </svg>
                  <span className="truncate max-w-[200px] md:max-w-[300px]">
                    {msg.content.match(/\[ATTACHED_PDF:\s*(.*?)\]/)?.[1]}
                  </span>
                </div>
                <div>
                  {msg.content.replace(/\[ATTACHED_PDF:\s*.*?\][\s\r\n]*/, "").trim()}
                </div>
              </>
            ) : (
              msg.content
            )}
          </div>
        ) : (
          <div className="markdown-body">
            {/* Show typing dots while waiting for first chunk */}
            {isStreaming && isLastMessage && !msg.content ? (
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
                <MarkdownRenderer content={msg.content} />
                {/* Blinking cursor while AI is still streaming */}
                {isStreaming && isLastMessage && (
                  <span className="inline-block w-0.75 h-[1.1em] bg-primary/70 rounded-full ml-0.5 align-middle animate-pulse" />
                )}
                {!isStreaming && msg.content && (
                  <div className="flex justify-start mt-2">
                    <button
                      onClick={handleSpeechToggle}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-primary transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      title={isSpeaking ? "Stop speaking" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <>
                          <StopCircleIcon size={16} weight="fill" className="text-primary animate-pulse" />
                          <span className="text-primary">Stop Speaking</span>
                        </>
                      ) : (
                        <>
                          <SpeakerHighIcon size={16} weight="bold" />
                          <span>Listen AI Response</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1 overflow-hidden shadow-sm">
          {user?.profilePicture ? (
            <Image
              src={user.profilePicture}
              width={32}
              height={32}
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
}
