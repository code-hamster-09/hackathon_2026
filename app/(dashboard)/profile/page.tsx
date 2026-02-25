"use client"

import { TopNavbar } from "@/components/top-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { currentUser, courses } from "@/lib/mock-data"
import {
  BookOpen,
  Clock,
  Trophy,
  Flame,
  Star,
  Calendar,
  Mail,
  Settings,
  Bell,
  Moon,
  Globe,
} from "lucide-react"

export default function ProfilePage() {
  const xpPercent = Math.round((currentUser.xp / currentUser.xpToNext) * 100)
  const completedCourses = courses.filter((c) => c.progress === 100).length

  const stats = [
    { icon: BookOpen, label: "Courses Completed", value: String(completedCourses) },
    { icon: Clock, label: "Study Hours", value: `${currentUser.totalHours}h` },
    { icon: Trophy, label: "Total Points", value: currentUser.points.toLocaleString() },
    { icon: Flame, label: "Day Streak", value: String(currentUser.streak) },
    { icon: Star, label: "Level", value: String(currentUser.level) },
    { icon: Calendar, label: "Member Since", value: "Sep 2025" },
  ]

  return (
    <div className="flex flex-col">
      <TopNavbar title="Profile" />
      <div className="flex flex-col gap-6 p-6">
        {/* Profile header */}
        <Card className="border-border/50">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                    Level {currentUser.level}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{currentUser.email}</p>
                <div className="mt-4 max-w-sm">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">XP to Level {currentUser.level + 1}</span>
                    <span className="font-medium text-primary">{currentUser.xp}/{currentUser.xpToNext}</span>
                  </div>
                  <Progress value={xpPercent} className="h-2" />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-2 text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Info */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">First Name</Label>
                  <Input defaultValue="Alex" className="bg-secondary/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Last Name</Label>
                  <Input defaultValue="Chen" className="bg-secondary/50" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Email</Label>
                <Input defaultValue={currentUser.email} className="bg-secondary/50" />
              </div>
              <Button className="mt-2 w-fit font-medium">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Get reminders for deadlines</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Digest</p>
                    <p className="text-xs text-muted-foreground">Weekly progress summary</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Moon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Language</p>
                    <p className="text-xs text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">EN</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
