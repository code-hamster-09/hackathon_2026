import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, ArrowRight } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    category: string
    progress: number
    totalLessons: number
    completedLessons: number
    duration: string
    author: string
    rating: number
    students: number
    difficulty: string
    tags: string[]
  }
}

const difficultyColor: Record<string, string> = {
  Beginner: "bg-accent/10 text-accent border-accent/20",
  Intermediate: "bg-primary/10 text-primary border-primary/20",
  Advanced: "bg-destructive/10 text-destructive border-destructive/20",
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group flex flex-col border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      {/* Category color bar */}
      <div className="h-1.5 rounded-t-lg bg-primary/60 transition-colors group-hover:bg-primary" />

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className={`text-xs ${difficultyColor[course.difficulty] || ""}`}>
            {course.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{course.rating}</span>
          </div>
        </div>

        <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.students.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span className="text-muted-foreground">{course.author}</span>
          </div>

          {course.progress > 0 && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{course.progress}% complete</span>
                <span className="font-medium text-foreground">
                  {course.completedLessons}/{course.totalLessons}
                </span>
              </div>
              <Progress value={course.progress} className="h-1.5" />
            </div>
          )}

          <Button
            asChild
            variant={course.progress > 0 ? "default" : "outline"}
            size="sm"
            className="mt-4 w-full font-medium"
          >
            <Link href={`/courses/${course.id}`}>
              {course.progress > 0 ? "Continue Learning" : "Start Course"}
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
