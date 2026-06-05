import React from 'react';

export default function ChatHeader({ currentChat }) {
  return (
    <div className="shrink-0 py-4 pt-[calc(max(env(safe-area-inset-top),16px))] pl-18 pr-4 md:py-5 md:pl-20 md:pr-8 border-b border-card-border/50 bg-background/80 backdrop-blur-md z-10 flex items-center justify-start shadow-sm transition-all">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate max-w-[85%] md:max-w-2xl">
        {currentChat?.title || "Active Chat"}
      </h2>
    </div>
  );
}
