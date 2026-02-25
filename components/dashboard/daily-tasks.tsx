"use client"

import { dailyTasks } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, FileText, HelpCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, React.ElementType> = {
  quiz: HelpCircle,
  video: PlayCircle,
  reading: FileText,
  project: CheckCircle2,
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning-foreground border-warning/20",
  low: "bg-secondary text-muted-foreground border-border",
}

export function DailyTasks() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          AI-Recommended Tasks
        </CardTitle>
        <Badge variant="secondary" className="text-xs font-medium">Today</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {dailyTasks.map((task) => {
          const Icon = typeIcons[task.type] || CheckCircle2
          return (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3 transition-all hover:border-primary/20 hover:bg-secondary/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                <p className="truncate text-xs text-muted-foreground">{task.course}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", priorityStyles[task.priority])}>
                  {task.dueTime}
                </Badge>
                <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Start
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
