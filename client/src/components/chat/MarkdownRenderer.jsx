import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content }) {
  return (
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
      {content}
    </ReactMarkdown>
  );
}
