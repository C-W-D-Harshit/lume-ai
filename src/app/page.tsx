"use client";

import React, { useEffect } from "react";
import AiInput from "./_components/AiInput";
import Intro from "./_components/Intro";
import ChatUI from "./_components/ChatUI";
import { Message, useChat } from "ai/react";
import { useUserChat } from "@/store/userChat";
import { useRouter } from "next/navigation";
import AI_MODELS from "./_components/AIMODELS";
import { toast } from "sonner";

export default function Page() {
  const { createChat } = useUserChat();
  const [initialChatCreation, setInitialChatCreation] = React.useState(false);
  const [model, setModel] = React.useState("OpenAI: GPT-4o-mini");
  const router = useRouter();

  const { messages, input, setInput, append, isLoading, stop, reload } =
    useChat({
      api: "/api/chat",
      onFinish() {
        setInitialChatCreation(true);
      },
      experimental_throttle: 100,
      onError(error) {
        toast.error("An error occurred. Please try refreshing the page.");
        console.error(error);
      },
    });

  useEffect(() => {
    if (initialChatCreation && !isLoading) {
      const handleChatCreation = async (message: Message) => {
        const msgs: {
          id: string;
          role: "user" | "assistant" | "system";
          content: string;
          createdAt: Date;
          model: string;
          provider: string;
        }[] = [
          {
            id: messages[0]?.id,
            role: "user",
            content: messages[0].content,
            createdAt: new Date(),
            model,
            provider: AI_MODELS.find((m) => m.value === model)?.provider || "",
          },
          {
            id: message.id,
            role: "assistant",
            content: message.content,
            createdAt: new Date(),
            model,
            provider: AI_MODELS.find((m) => m.value === model)?.provider || "",
          },
        ];

        const id = await createChat("gpt-4o-mini", msgs);

        router.push(`/c/${id}`);

        return id;
      };
      setTimeout(() => {
        handleChatCreation(messages[1]);
      }, 100);
      setInitialChatCreation(false);
    }
  }, [createChat, initialChatCreation, isLoading, messages, router, model]);

  return (
    <div className="flex-1 flex justify-center">
      <div className="max-w-4xl flex-1 flex flex-col gap-6 justify-between relative">
        <div></div>
        {messages.length === 0 ? (
          <Intro />
        ) : (
          <ChatUI reload={reload} messages={messages} isLoading={isLoading} />
        )}
        <div className="sticky bottom-4">
          <AiInput
            isLoading={isLoading}
            stop={stop}
            append={append}
            input={input}
            setInput={setInput}
            model={model}
            setModel={setModel}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-background/0 -z-10" />
      </div>
    </div>
  );
}
