"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, KeyIcon, KeyRoundIcon } from "lucide-react";
import Cookies from "js-cookie";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ApiKeysForm() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedOpenAIKey = Cookies.get("openAIKey");
    if (storedOpenAIKey) setOpenAIKey(storedOpenAIKey);
  }, []);

  const saveKeys = () => {
    if (!openAIKey) {
      toast({
        title: "No API Keys Provided",
        description: "Please enter at least one API key.",
        variant: "destructive",
      });
      return;
    }

    Cookies.set("openAIKey", openAIKey, { expires: 365 });
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely saved.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">API Keys</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKeys(!showKeys)}
                  className="h-8 w-8"
                >
                  {showKeys ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showKeys ? "Hide API Keys" : "Show API Keys"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Securely store your AI provider API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <KeyRoundIcon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="openai-key" className="text-base">
                Open Router API Key
              </Label>
            </div>
            <Input
              id="openai-key"
              type={showKeys ? "text" : "password"}
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
              className="font-mono bg-background"
            />
          </div>
        </div>

        <Button onClick={saveKeys} className="w-full mt-6" size="lg">
          Save API Keys
        </Button>
      </CardContent>
    </Card>
  );
}
