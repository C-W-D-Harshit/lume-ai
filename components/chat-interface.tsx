"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useChat } from "ai/react";
import {
  Send,
  Paperclip,
  X,
  FileIcon,
  FileTextIcon,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AttachmentPreviews from "./attachment-previews";
import { ChatMessage } from "./chat-message";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { WelcomeScreen } from "./welcome-screen";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useChats } from "@/hooks/use-chats";

interface ChatInterfaceProps {
  chatId?: string;
}

const models = [
  { name: "OpenAI: ChatGPT-4o", value: "openai/chatgpt-4o-latest", cost: 0.1 },
  { name: "OpenAI: GPT-4 Turbo", value: "openai/gpt-4-turbo", cost: 0.08 },
  { name: "OpenAI: GPT-3.5 Turbo", value: "openai/gpt-3.5-turbo", cost: 0.05 },
  { name: "OpenAI: GPT-4o-mini", value: "openai/gpt-4o-mini", cost: 0.0 },
  { name: "OpenAI: o1-mini", value: "openai/o1-mini", cost: 0.06 },
  {
    name: "Anthropic: Claude 3.5 Sonnet",
    value: "anthropic/claude-3.5-sonnet",
    cost: 0.09,
  },
  {
    name: "Anthropic: Claude 3 Haiku",
    value: "anthropic/claude-3-haiku",
    cost: 0.04,
  },
  {
    name: "Anthropic: Claude 3 Opus",
    value: "anthropic/claude-3-opus",
    cost: 0.11,
  },
  {
    name: "Google: Gemini 1.5 Flash-8B",
    value: "google/gemini-flash-1.5-8b",
    cost: 0.03,
  },
  {
    name: "Meta: Llama 3.1 8B Instruct",
    value: "meta-llama/llama-3.1-8b-instruct",
    cost: 0.035,
  },
  {
    name: "Google: Gemma 2 27B",
    value: "google/gemma-2-27b-it",
    cost: 0.27,
  },
  {
    name: "xAI: Grok 2",
    value: "x-ai/grok-2",
    cost: 0.07,
  },
  {
    name: "OpenAI: o1-preview",
    value: "openai/o1-preview",
    cost: 37.5,
  },
  // add dall-e-3
  {
    name: "OpenAI: dall-e-3",
    value: "dall-e-3",
    cost: 0.015,
    openai: true,
  },
];

// Sort models by cost in ascending order
models.sort((a, b) => a.cost - b.cost);

const ACCEPTED_FILE_TYPES = `
  .pdf,.doc,.docx,.xls,.xlsx,.csv,
  .jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.avif,.heic,.heif,
  .txt,.rtf,.md,.json,.xml,.html,.css,.js,.ts,.tsx
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const estimateMessageHeight = (message: any) => {
  const baseHeight = 100;
  const charsPerLine = 60;
  const lineHeight = 24;

  const lines = Math.ceil(message.content.length / charsPerLine);
  const contentHeight = lines * lineHeight;

  const hasCodeBlock = message.content.includes("```");
  const hasImage = message.content.startsWith("data:image");

  let extraHeight = 0;
  if (hasCodeBlock) extraHeight += 200;
  if (hasImage) extraHeight += 300;

  return baseHeight + contentHeight + extraHeight;
};

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [model, setModel] = useState(models[0].value);
  const { updateChat } = useChats();
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "/api/chat",
      id: chatId,
      credentials: "include",
      experimental_throttle: 200,
      body: {
        model: model,
        openai: models.find((m) => m.value === model)?.openai,
      },
      onFinish: (message) => {
        if (chatId) {
          const title =
            message.content.slice(0, 20) +
            (message.content.length > 30 ? "..." : "");
          updateChat(chatId, { title });
        }
      },
    });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<List>(null);
  const sizeMap = useRef<{ [key: string]: number }>({});

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current?.resetAfterIndex(index);
  }, []);

  const getSize = useCallback(
    (index: number) => {
      return sizeMap.current[index] || estimateMessageHeight(messages[index]);
    },
    [messages]
  );

  console.log("rerender");

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div
        style={{
          ...style,
          height: "auto",
          position: "absolute",
          top: style.top,
          left: 0,
          width: "100%",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <ChatMessage
          message={messages[index]}
          onHeightChange={(height) => setSize(index, height + 32)}
          // onEdit={(newContent) => handleEditMessage(index, newContent)}
          // onDelete={() => handleDeleteMessage(index)}
        />
      </div>
    ),
    [messages, setSize]
  );

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setAttachments((prev) => [...prev, ...newFiles]);
      if (
        e.target.files.length > 0 &&
        e.target.files[0].type.startsWith("image/")
      ) {
        setFiles(e.target.files);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiKey = Cookies.get("openRouterApiKey");
    if (!apiKey) {
      toast({
        title: "No API Key Found",
        description: "Please set your API key in the preferences.",
        variant: "destructive",
        action: (
          <Link href="/settings">
            <Button variant="outline">Go to Settings</Button>
          </Link>
        ),
      });
      return;
    }
    handleSubmit(e, {
      experimental_attachments: files,
    });
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (fileType === "application/pdf")
      return <FileTextIcon className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items;
      if (items) {
        let preventDefault = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) {
              preventDefault = true;
              setAttachments((prev) => [...prev, file]);
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                setFiles(dataTransfer.files);
              }
            }
          }
        }
        if (preventDefault) {
          e.preventDefault();
        }
      }
    },
    []
  );

  console.log("files", files);

  // const handleEditMessage = (index: number, newContent: string) => {
  //   const newMessages = [...messages];
  //   newMessages[index] = { ...newMessages[index], content: newContent };
  //   setMessages(newMessages);
  // };

  // const handleDeleteMessage = (index: number) => {
  //   const newMessages = messages.filter((_, i) => i !== index);
  //   setMessages(newMessages);
  // };

  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current?.scrollToItem(messages.length - 1, "end");
    }
  }, [messages]);

  // store the messages in local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`messages-${chatId}`, JSON.stringify(messages));
    }
  }, [messages, chatId]);

  // get the messages from local storage
  useEffect(() => {
    if (chatId) {
      const messages = localStorage.getItem(`messages-${chatId}`);
      if (messages) {
        setMessages(JSON.parse(messages));
      }
    }
  }, [chatId, setMessages]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 relative">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                height={height}
                itemCount={messages.length}
                itemSize={getSize}
                width={width}
                overscanCount={5}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        )}
      </div>
      <div className="border-t border-border p-4 sticky bottom-0">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleAttachment}
              accept={ACCEPTED_FILE_TYPES}
              multiple
              aria-label="File attachment"
            />
          </div>
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-muted/40 rounded-lg">
              {attachments.map((file, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 py-1 px-2"
                >
                  {getFileIcon(file.type)}
                  <span className="max-w-[120px] truncate text-xs">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          <AttachmentPreviews files={attachments} />
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder="Type your message or paste an image..."
              className="flex-1 min-h-[100px] resize-none"
              aria-label="Message input"
            />
            <Button
              type="submit"
              size="icon"
              className="h-[100px] w-[100px]"
              aria-label="Send message"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
