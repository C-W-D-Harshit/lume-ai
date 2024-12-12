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
  const [openRouterApiKey, setopenRouterApiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedopenRouterApiKey = localStorage.getItem("openRouterApiKey");
    const storedAnthropicKey = localStorage.getItem("anthropicKey");
    if (storedopenRouterApiKey) setopenRouterApiKey(storedopenRouterApiKey);
    if (storedAnthropicKey) setAnthropicKey(storedAnthropicKey);
  }, []);

  const saveKeys = () => {
    localStorage.setItem("openRouterApiKey", openRouterApiKey);
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
                value={openRouterApiKey}
                onChange={(e) => setopenRouterApiKey(e.target.value)}
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
