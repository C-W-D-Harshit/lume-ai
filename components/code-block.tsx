"use client";

import { memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  value: string;
  title?: string;
}

export const CodeBlock = memo(function CodeBlock({
  language,
  value,
  title,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="w-full rounded-lg overflow-hidden bg-zinc-900 ">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">{title}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem",
          }}
          codeTagProps={{
            style: {
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});
