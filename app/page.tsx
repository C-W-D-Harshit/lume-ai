import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <div className="flex flex-1 bg-background text-foreground">
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
