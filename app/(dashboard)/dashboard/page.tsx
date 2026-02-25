import { TopNavbar } from "@/components/top-navbar"
import { GreetingCard } from "@/components/dashboard/greeting-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyTasks } from "@/components/dashboard/daily-tasks"
import { ProgressOverview } from "@/components/dashboard/progress-overview"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <TopNavbar title="Dashboard" />
      <div className="flex flex-col gap-6 p-6">
        <GreetingCard />
        <QuickActions />
        <div className="grid gap-6 lg:grid-cols-2">
          <DailyTasks />
          <ProgressOverview />
        </div>
        <ActivityTimeline />
      </div>
    </div>
  )
}
