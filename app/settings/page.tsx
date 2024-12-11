import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Sparkles, BarChart3 } from "lucide-react";
import { PreferencesForm } from "@/components/preferences-form";
import { TokenUsageChart } from "@/components/token-usage-chart";
import { UsageStats } from "@/components/usage-stats";

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Settings
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Customize your Lume-AI experience and manage your account.
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-primary opacity-20" />
          </div>
          <Separator className="my-6" />
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="w-full border-b border-border bg-transparent p-0">
              <div className="flex gap-4">
                <TabsTrigger
                  value="general"
                  className="border-b-2 border-transparent px-4 pb-3 pt-2 text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="usage"
                  className="border-b-2 border-transparent px-4 pb-3 pt-2 text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  Usage & Billing
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="general" className="space-y-6">
              <PreferencesForm />
            </TabsContent>
            <TabsContent value="usage" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Card className="bg-card rounded-lg p-4 shadow-sm">
                    <CardHeader className="px-0 pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-xl font-semibold">
                          Usage Overview
                        </CardTitle>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <UsageStats
                        totalTokens={125000}
                        totalCost={2.5}
                        totalChats={42}
                        averageTokensPerChat={2976}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2">
                  <TokenUsageChart />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
