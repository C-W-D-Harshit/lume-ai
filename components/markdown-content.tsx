"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./code-block";
// import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = memo(function MarkdownContent({
  content,
}: MarkdownContentProps) {
  return (
    <ReactMarkdown
      // remarkPlugins={[remarkGfm]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          if (!inline && language) {
            return (
              <CodeBlock
                language={language}
                value={String(children).replace(/\n$/, "")}
                title={language}
                {...props}
              />
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a: ({ href, children }) => {
          const isInternalLink =
            href && (href.startsWith("/") || href.startsWith("#"));
          if (isInternalLink) {
            return (
              <Link href={href} className="text-blue-500 hover:underline">
                {children}
              </Link>
            );
          }
          return (
            <a
              href={href}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },

        img: ({ src, alt }) => (
          <div className="my-4">
            <Image
              src={src || "/placeholder.png"}
              alt={alt || "Image"}
              width={700}
              height={400}
              className="max-w-full h-auto rounded-lg"
              style={{ objectFit: "contain" }}
            />
          </div>
        ),
      }}
      className="w-full max-w-full prose dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/70 prose-code:text-primary prose-pre:bg-muted prose-pre:text-muted-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-em:text-foreground"
    >
      {content}
    </ReactMarkdown>
  );
});
