import { activityTimeline } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Trophy, PlayCircle, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  complete: { icon: CheckCircle2, color: "text-accent bg-accent/10" },
  achievement: { icon: Trophy, color: "text-warning bg-warning/10" },
  start: { icon: PlayCircle, color: "text-primary bg-primary/10" },
  score: { icon: Star, color: "text-accent bg-accent/10" },
}

export function ActivityTimeline() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {activityTimeline.map((item, index) => {
            const config = typeConfig[item.type] || typeConfig.complete
            const Icon = config.icon
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{item.action}</span>
                    {" "}&middot;{" "}{item.detail}
                  </p>
                  {item.course && (
                    <p className="text-xs text-muted-foreground">{item.course}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
