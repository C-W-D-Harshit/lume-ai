"use client";

import { useState } from "react";
import {
  Home,
  Plus,
  Settings,
  MessageSquare,
  Trash2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResizable } from "@/hooks/use-resizable";
import { useChats } from "@/hooks/use-chats";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { width, startResizing } = useResizable(256, 200, 400);
  const router = useRouter();
  const { chats, activeChat, setActiveChat, createChat, deleteChat } =
    useChats();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNewChat = () => {
    const newChatId = createChat();
    router.push(`/chat/${newChatId}`);
    setIsMobileMenuOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4">
        <Link href="/">
          <h2 className="text-xl font-bold">Lume-AI</h2>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                aria-label="New chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="px-2 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start font-normal"
          onClick={handleNewChat}
        >
          <Home className="mr-2 h-4 w-4" />
          <span>Home</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div key={chat.id} className="flex items-center">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start font-normal",
                  activeChat === chat.id && "bg-accent"
                )}
                onClick={() => {
                  setActiveChat(chat.id);
                  router.push(`/chat/${chat.id}`);
                  setIsMobileMenuOpen(false);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <div className="flex-1 truncate">
                  <span className="truncate">{chat.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDate(chat.updatedAt)}
                  </span>
                </div>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteChat(chat.id)}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Chat</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 mt-auto">
        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "bg-background border-r border-border flex-col h-full hidden md:flex",
          className
        )}
        style={{ width: `${width}px` }}
      >
        <SidebarContent />
      </aside>
      <div
        className="w-1 cursor-col-resize bg-border hover:bg-primary transition-colors hidden md:block"
        onMouseDown={startResizing}
      />
    </>
  );
}
