import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, BarChart3, MessageSquare, Trophy } from "lucide-react"

const actions = [
  { href: "/courses", label: "Browse Courses", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { href: "/analytics", label: "View Analytics", icon: BarChart3, color: "bg-accent/10 text-accent" },
  { href: "/assistant", label: "Ask AI", icon: MessageSquare, color: "bg-chart-3/10 text-chart-3" },
  { href: "/gamification", label: "Achievements", icon: Trophy, color: "bg-warning/10 text-warning-foreground" },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className="group cursor-pointer border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
            <CardContent className="flex flex-col items-center gap-1.5 p-3 text-center sm:gap-2 sm:p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${action.color} transition-transform group-hover:scale-110`}>
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs font-medium text-foreground sm:text-sm">{action.label}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
