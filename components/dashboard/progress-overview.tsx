import Link from "next/link"
import { courses } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function ProgressOverview() {
  const activeCourses = courses.filter((c) => c.progress > 0 && c.progress < 100).slice(0, 3)

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Прогресс курсов</CardTitle>
        <Link href="/courses" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          Посмотреть все <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activeCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group rounded-xl border border-border/50 bg-secondary/30 p-4 transition-all hover:border-primary/20 hover:bg-secondary/60"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary">{course.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{course.author}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {course.completedLessons}/{course.totalLessons}
              </Badge>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
              </div>
              <Progress value={course.progress} className="h-1.5" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
