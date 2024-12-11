import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { MarkdownContent } from "./markdown-content";
import { Message } from "ai/react";
import Image from "next/image";

interface ChatMessageProps {
  message: Message;
  onHeightChange?: (height: number) => void;
}

export function ChatMessage({ message, onHeightChange }: ChatMessageProps) {
  const isUser = message.role === "user";
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current && onHeightChange) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          onHeightChange(entry.contentRect.height);
        }
      });

      observer.observe(messageRef.current);
      return () => observer.disconnect();
    }
  }, [onHeightChange]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isUser && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            "bg-gradient-to-b",
            isUser
              ? "from-blue-500 to-blue-600"
              : "from-violet-500 to-violet-600"
          )}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-2 w-full max-w-[70%]",
          isUser && "items-end w-fit"
        )}
      >
        <div
          className={cn(
            "w-full rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser ? "bg-accent" : "bg-muted"
          )}
        >
          <MarkdownContent content={message.content} />
          {message.experimental_attachments &&
            message.experimental_attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.experimental_attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {attachment.contentType?.startsWith("image/") ? (
                      <Image
                        src={attachment.url}
                        alt={attachment.name || "Attachment"}
                        width={50}
                        height={50}
                        className="rounded-md max-w-full h-auto"
                      />
                    ) : (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
