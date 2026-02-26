"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useMemo, useState } from "react"

import { TopNavbar } from "@/components/top-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { lessonsByCourse, quizzesByLesson, type QuizQuestion } from "@/lib/course-content"
import { courses } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { ArrowLeft, CheckCircle2, PlayCircle, Sparkles } from "lucide-react"

type Params = Promise<{ id: string; lessonId: string }>

export default function LessonPage({ params }: { params: Params }) {
  const { id, lessonId } = use(params)
  const router = useRouter()

  const course = courses.find((c) => c.id === id)
  const lessons = lessonsByCourse[id] ?? []
  const lesson = lessons.find((l) => l.id === lessonId)

  const quizKey = `${id}:${lessonId}`
  const quiz = quizzesByLesson[quizKey] ?? []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion: QuizQuestion | undefined = quiz[currentIndex]

  const answeredCount = useMemo(
    () => quiz.filter((q) => answers[q.id]).length,
    [quiz, answers],
  )

  const score = useMemo(() => {
    if (!isFinished || quiz.length === 0) return null
    const correct = quiz.filter((q) => answers[q.id] === q.correctOptionId).length
    return Math.round((correct / quiz.length) * 100)
  }, [isFinished, quiz, answers])

  if (!course || !lesson) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <TopNavbar title="Урок не найден" />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-lg font-semibold text-foreground">Урок не найден</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/courses">Вернуться к курсам</Link>
          </Button>
        </div>
      </div>
    )
  }

  function handleSelect(optionId: string) {
    if (isFinished || !currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  function handleNext() {
    if (!currentQuestion) return
    const currentAnswer = answers[currentQuestion.id]
    if (!currentAnswer) return

    const isLast = currentIndex === quiz.length - 1
    if (isLast) {
      setIsFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function handleExplainWithAI() {
    if (!course || !lesson) return
    if (!quiz.length) return
    const wrong = quiz.filter((q) => answers[q.id] && answers[q.id] !== q.correctOptionId)
    const correct = quiz.filter((q) => answers[q.id] === q.correctOptionId)

    const promptParts: string[] = []
    promptParts.push(
      `Я прошёл(а) тест по уроку "${lesson.title}" в курсе "${course.title}". Ответь простым человеческим языком и по шагам.`,
    )
    promptParts.push("")
    promptParts.push("Сначала кратко оцени мой результат, а потом разберём ошибки по одной.")
    promptParts.push(`Всего вопросов: ${quiz.length}. Правильных: ${correct.length}.`)
    promptParts.push("")

    if (wrong.length > 0) {
      promptParts.push("Ошибочные ответы:")
      wrong.forEach((q, idx) => {
        const userId = answers[q.id]
        const userOpt = q.options.find((o) => o.id === userId)
        const correctOpt = q.options.find((o) => o.id === q.correctOptionId)
        if (!userOpt || !correctOpt) return
        promptParts.push(
          `${idx + 1}) Вопрос: "${q.question}". Мой ответ: "${userOpt.label}". Правильный ответ: "${correctOpt.label}".`,
        )
      })
      promptParts.push("")
      promptParts.push(
        "Разбирай ошибки по одной: сначала объясни простыми словами, почему мой ответ неточен, потом дай метафору или пример из жизни, и только затем — как правильно мыслить в подобных задачах. Переходи к следующей ошибке только после завершения объяснения предыдущей.",
      )
    } else {
      promptParts.push(
        "Я ответил(а) на все вопросы верно. Помоги закрепить материал простыми примерами и метафорами и предложи один-два усложнённых вопроса по теме.",
      )
    }

    const prompt = promptParts.join("\n")
    router.push(`/assistant?q=${encodeURIComponent(prompt)}`)
  }

  function handleRestart() {
    setAnswers({})
    setCurrentIndex(0)
    setIsFinished(false)
  }

  const progressValue =
    quiz.length === 0 ? 0 : ((Math.min(currentIndex, quiz.length - 1) + (isFinished ? 1 : 0)) / quiz.length) * 100

  const currentAnswerId = currentQuestion ? answers[currentQuestion.id] : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <TopNavbar title={course.title} />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/courses/${id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Вернуться к курсу
          </Link>
          <Badge variant="outline" className="text-[11px]">
            Урок: {lesson.title}
          </Badge>
        </div>

        {/* Видеоплеер на всю ширину */}
        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_22px_50px_rgba(15,23,42,0.9)]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary shadow-[0_0_36px_rgba(56,189,248,0.8)]">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-50">
                        {lesson.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-300/80">
                        {lesson.preview}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{lesson.duration}</span>
                </div>

                <div className="mt-6 flex flex-1 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/60 text-center">
                  <p className="px-6 text-xs text-slate-300">
                    Место для реального видеоплеера. Сейчас используется стилизованный плейсхолдер —
                    сюда можно встроить HTML5 video, Vimeo, YouTube или собственный плеер.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Тест по одному вопросу */}
        <Card className="border-border/60 p-4 rounded-3xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl font-semibold text-foreground">
                Тест по уроку
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {answeredCount}/{quiz.length} отвечено
              </span>
            </div>
            <div className="mt-2">
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!quiz.length && (
              <p className="text-xs text-muted-foreground">
                Тест для этого урока появится здесь в ближайшее время.
              </p>
            )}

            {!!quiz.length && !isFinished && currentQuestion && (
              <>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Вопрос {currentIndex + 1} из {quiz.length}
                  </p>
                  <p className="text-xl font-medium text-foreground">
                    {currentQuestion.question}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {currentQuestion.options.map((opt) => {
                    const selected = opt.id === currentAnswerId
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(opt.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-2xl border px-4 py-2 text-left text-xl transition-all",
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border/60 bg-background/40 hover:border-primary/40",
                        )}
                      >
                        <span className="text-sm font-semibold text-muted-foreground">
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm text-foreground">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Выбери ответ и нажми «Следующий», чтобы перейти к следующему вопросу.
                  </p>
                  <Button
                    size="default"
                    className="text-md font-medium"
                    disabled={!currentAnswerId}
                    onClick={handleNext}
                  >
                    Следующий
                  </Button>
                </div>
              </>
            )}

            {/* Результат */}
            {isFinished && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Тест завершён
                    </p>
                    {score !== null && (
                      <p className="text-xs text-muted-foreground">
                        Твой результат:{" "}
                        <span className="font-semibold text-foreground">{score}%</span>{" "}
                        ({answeredCount} из {quiz.length} вопросов с ответами).
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs font-medium"
                    onClick={handleExplainWithAI}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Объяснить ИИ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={handleRestart}
                  >
                    Пройти тест снова
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Нажми «Объяснить ИИ», чтобы перейти в диалог, где ассистент разберёт твои
                  ошибки простым языком, по одной, с понятными примерами. После разбора можно
                  вернуться и пройти тест ещё раз.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


