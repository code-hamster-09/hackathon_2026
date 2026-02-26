"use client"

import Link from "next/link"
import { use } from "react"

import { TopNavbar } from "@/components/top-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { lessonsByCourse } from "@/lib/course-content"
import { courses } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { ArrowLeft, Calendar, CheckCircle2, Clock, PlayCircle, Star, User, Users } from "lucide-react"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const course = courses.find((c) => c.id === id)
  const lessons = lessonsByCourse[id] ?? []

  if (!course) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <TopNavbar title="Курс не найден" />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-lg font-semibold text-foreground">Курс не найден</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/courses">Вернуться к курсам</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <TopNavbar title={course.title} />
      <div className="flex flex-col gap-6 p-6">
        {/* Back button */}
        <Link
          href="/courses"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к курсам
        </Link>

        {/* Course header */}
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <Badge className="mb-3 bg-primary-foreground/20 text-primary-foreground">
                {course.category}
              </Badge>
              <h2 className="text-2xl font-bold lg:text-3xl">{course.title}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-primary-foreground/80">
                {course.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {course.author}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due {course.deadline}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-3xl font-bold">{course.progress}%</p>
                <p className="text-sm text-primary-foreground/70">completed</p>
              </div>
              <Progress value={course.progress} className="h-2 w-48 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Список уроков */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Уроки
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {lessons.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Уроки для этого курса появятся здесь в ближайшее время.
                  </p>
                )}
                {lessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${id}/lessons/${lesson.id}`}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border border-border/60 bg-secondary/40 p-4 transition-all hover:border-primary/40 hover:bg-secondary/70",
                    )}
                  >
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          {index + 1}. {lesson.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {lesson.duration}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {lesson.preview}
                      </p>
                      {lesson.completed && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Выполнено
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar info */}
          <div className="flex flex-col gap-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Информация о курсе</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Сложность</span>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Уроки</span>
                  <span className="font-medium text-foreground">{course.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Выполнено</span>
                  <span className="font-medium text-foreground">{course.completedLessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Продолжительность</span>
                  <span className="font-medium text-foreground">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Срок выполнения</span>
                  <span className="font-medium text-foreground">{course.deadline}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Теги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {course.progress === 100 && (
              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                  <p className="font-semibold text-foreground">Курс выполнен!</p>
                  <p className="text-sm text-muted-foreground">Отличная работа по выполнению этого курса.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

