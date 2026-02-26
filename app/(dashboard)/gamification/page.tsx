"use client"

import { TopNavbar } from "@/components/top-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { currentUser, achievements } from "@/lib/mock-data"
import {
  Zap,
  Flame,
  BookOpen,
  Trophy,
  CheckCircle2,
  Users,
  Moon,
  Timer,
  Lock,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  flame: Flame,
  "book-open": BookOpen,
  trophy: Trophy,
  "check-circle": CheckCircle2,
  users: Users,
  moon: Moon,
  timer: Timer,
}

export default function GamificationPage() {
  const xpPercent = Math.round((currentUser.xp / currentUser.xpToNext) * 100)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <TopNavbar title="Достижения" />
      <div className="flex flex-col gap-6 p-6">
        {/* Level card */}
        <Card className="overflow-hidden border-border/50">
          <div className="bg-primary p-6 text-primary-foreground lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 text-3xl font-bold">
                  {currentUser.level}
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/70">Текущий уровень</p>
                  <p className="text-2xl font-bold">Знаток</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/70">
                    {currentUser.xp} / {currentUser.xpToNext} XP to Level {currentUser.level + 1}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{currentUser.points.toLocaleString()}</p>
                  <p className="text-sm text-primary-foreground/70">Общее количество очков</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{currentUser.streak}</p>
                  <p className="text-sm text-primary-foreground/70">Дней подряд</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{unlockedCount}/{achievements.length}</p>
                  <p className="text-sm text-primary-foreground/70">Достижения</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={xpPercent} className="h-3 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
            </div>
          </div>
        </Card>

        {/* Achievements grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Все достижения</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {achievements.map((achievement) => {
              const Icon = iconMap[achievement.icon] || Star
              return (
                <Card
                  key={achievement.id}
                  className={cn(
                    "border-border/50 transition-all",
                    achievement.unlocked
                      ? "hover:border-primary/20 hover:shadow-md"
                      : "opacity-60"
                  )}
                >
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl",
                        achievement.unlocked
                          ? "bg-primary/10"
                          : "bg-muted"
                      )}
                    >
                      {achievement.unlocked ? (
                        <Icon className="h-7 w-7 text-primary" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.unlocked ? (
                      <Badge className="mt-3 bg-accent/10 text-accent border-accent/20" variant="outline">
                        Разблокировано {achievement.date}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-3 text-xs">
                        Заблокировано
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
