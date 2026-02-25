"use client"

import { TopNavbar } from "@/components/top-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { weeklyActivity, monthlyProgress, performanceData, currentUser } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, BookOpen, Clock, Target } from "lucide-react"

const statCards = [
  {
    label: "Courses Completed",
    value: "8",
    change: "+2 this month",
    icon: BookOpen,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Total Study Hours",
    value: "156h",
    change: "+18h this week",
    icon: Clock,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Avg. Score",
    value: "88%",
    change: "+3% improvement",
    icon: Target,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    label: "Completion Rate",
    value: "92%",
    change: "Top 5% of learners",
    icon: TrendingUp,
    color: "bg-warning/10 text-warning-foreground",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      <TopNavbar title="Analytics" />
      <div className="flex flex-col gap-6 p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xs font-medium text-accent">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="day" fontSize={12} stroke="hsl(215, 16%, 47%)" />
                    <YAxis fontSize={12} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(214, 32%, 91%)",
                        borderRadius: "8px",
                        color: "hsl(222, 47%, 11%)",
                      }}
                    />
                    <Bar dataKey="hours" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="month" fontSize={12} stroke="hsl(215, 16%, 47%)" />
                    <YAxis fontSize={12} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(214, 32%, 91%)",
                        borderRadius: "8px",
                        color: "hsl(222, 47%, 11%)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="hsl(217, 91%, 60%)"
                      fill="hsl(217, 91%, 60%)"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="started"
                      stackId="2"
                      stroke="hsl(168, 76%, 42%)"
                      fill="hsl(168, 76%, 42%)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Radar */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto h-80 max-w-lg">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="hsl(214, 32%, 91%)" />
                  <PolarAngleAxis dataKey="subject" fontSize={12} stroke="hsl(215, 16%, 47%)" />
                  <PolarRadiusAxis fontSize={10} stroke="hsl(215, 16%, 47%)" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(217, 91%, 60%)"
                    fill="hsl(217, 91%, 60%)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
