import { TopNavbar } from "@/components/top-navbar"
import { GreetingCard } from "@/components/dashboard/greeting-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyTasks } from "@/components/dashboard/daily-tasks"
import { ProgressOverview } from "@/components/dashboard/progress-overview"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <TopNavbar title="Дашборд" />
      <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
        <GreetingCard />
        <QuickActions />
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <DailyTasks />
          <ProgressOverview />
        </div>
        <ActivityTimeline />
      </div>
    </div>
  )
}
