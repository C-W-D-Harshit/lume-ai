"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KeyIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ApiKeyPopover() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedOpenAIKey = localStorage.getItem("openAIKey");
    const storedAnthropicKey = localStorage.getItem("anthropicKey");
    if (storedOpenAIKey) setOpenAIKey(storedOpenAIKey);
    if (storedAnthropicKey) setAnthropicKey(storedAnthropicKey);
  }, []);

  const saveKeys = () => {
    localStorage.setItem("openAIKey", openAIKey);
    localStorage.setItem("anthropicKey", anthropicKey);
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <KeyIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">API Keys</h4>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="Enter your Anthropic API key"
              />
            </div>
          </div>
          <Button onClick={saveKeys}>Save API Keys</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
