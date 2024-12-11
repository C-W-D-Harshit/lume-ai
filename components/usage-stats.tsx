'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon, CoinsIcon as TokensIcon, DollarSignIcon, MessageSquareIcon, ZapIcon } from 'lucide-react'

interface UsageStatsProps {
  totalTokens: number
  totalCost: number
  totalChats: number
  averageTokensPerChat: number
}

export function UsageStats({ 
  totalTokens,
  totalCost,
  totalChats,
  averageTokensPerChat,
}: UsageStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tokens Used</CardTitle>
          <TokensIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-xs text-muted-foreground">
                <InfoIcon className="h-3 w-3 inline mr-1" />
                What are tokens?
              </TooltipTrigger>
              <TooltipContent>
                <p>Tokens are units of text processed by the AI model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalCost.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Based on current usage</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
          <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalChats}</div>
          <p className="text-xs text-muted-foreground">Conversations initiated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Tokens/Chat</CardTitle>
          <ZapIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTokensPerChat.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Average usage per conversation</p>
        </CardContent>
      </Card>
    </div>
  )
}

