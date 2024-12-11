"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export default function Settings() {
  const { toast } = useToast();

  const clearCookies = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    toast({
      title: "Cookies Cleared",
      description: "All stored data has been cleared.",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="space-y-4">
        <div>
          <Label>Clear Cookies</Label>
          <p className="text-sm text-muted-foreground mb-2">
            This will remove all stored data, including API keys.
          </p>
          <Button onClick={clearCookies} variant="destructive">
            Clear Cookies
          </Button>
        </div>
      </div>
    </div>
  );
}
