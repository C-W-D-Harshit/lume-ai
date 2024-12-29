"use client";

import { memo, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const highlightedCode = useMemo(
    () => (
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
    ),
    [language, value]
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full rounded-lg overflow-hidden bg-zinc-900">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
          <span className="text-sm text-zinc-400">{title}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="relative">{highlightedCode}</div>
    </div>
  );
});
