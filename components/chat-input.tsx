"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

export default function ChatInput() {
  const { input, handleInputChange, handleSubmit } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex items-end space-x-2 p-4 bg-background/80 backdrop-blur-sm border-t border-border"
    >
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={handleTextareaChange}
        placeholder="Type your message..."
        className="flex-1 min-h-[50px] max-h-[200px] bg-background resize-none rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        rows={1}
      />
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
      >
        <SendIcon className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
