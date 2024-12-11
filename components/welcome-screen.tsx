import { Bot, Sparkles, MessageSquare, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10 animate-pulse">
          <Bot className="w-16 h-16 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Lume-AI
          </span>
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-[600px]">
          Your cutting-edge AI assistant for natural conversations and
          multimodal interactions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-[900px]">
        <Card className="p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="space-y-2 py-2">
            <div className="p-2 w-fit rounded-lg bg-primary/10">
              <MessageSquare
                className="w-6 h-6 text-primary"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-xl font-semibold">Natural Conversations</h2>
            <p className="text-sm text-muted-foreground">
              Engage in fluid, context-aware conversations with state-of-the-art
              language models
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="space-y-2 py-2">
            <div className="p-2 w-fit rounded-lg bg-primary/10">
              <ImageIcon className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">Multimodal Support</h2>
            <p className="text-sm text-muted-foreground">
              Share images, documents, and other files for rich, interactive
              discussions
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="space-y-2 py-2">
            <div className="p-2 w-fit rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">Advanced Features</h2>
            <p className="text-sm text-muted-foreground">
              Customize responses, track usage, and leverage multiple AI models
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
