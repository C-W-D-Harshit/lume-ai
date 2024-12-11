'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUpIcon } from 'lucide-react'

const data = [
  { date: '2024-01-01', tokens: 1200 },
  { date: '2024-01-02', tokens: 2400 },
  { date: '2024-01-03', tokens: 1800 },
  { date: '2024-01-04', tokens: 3200 },
  { date: '2024-01-05', tokens: 2800 },
  { date: '2024-01-06', tokens: 1600 },
  { date: '2024-01-07', tokens: 2100 },
]

export function TokenUsageChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <TrendingUpIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl">Token Usage</CardTitle>
        </div>
        <CardDescription>Your token consumption over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `${value}tk`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {new Date(payload[0].payload.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Tokens
                            </span>
                            <span className="font-bold">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="tokens"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

