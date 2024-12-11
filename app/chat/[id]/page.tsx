"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ChatInterface from "@/components/chat-interface";
import { useChats } from "@/hooks/use-chats";

export default function ChatPage() {
  const params = useParams();
  const { setActiveChat } = useChats();
  const chatId = params.id as string;

  useEffect(() => {
    setActiveChat(chatId);
  }, [chatId, setActiveChat]);

  return <ChatInterface chatId={chatId} />;
}
