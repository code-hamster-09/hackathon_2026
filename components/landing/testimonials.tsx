import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Jordan Lee",
    role: "Инженер-программист",
    initials: "JL",
    quote:
      "Рекомендации ИИ EduFlow помогли мне перейти от фронтенд-разработки к полноstack-разработке за 3 месяца. Персонализированные учебные пути впечатляют.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Аналитик данных",
    initials: "MS",
    quote:
      "Дашборд аналитики даёт мне чёткие представления о том, где я преуспеваю и где мне нужно улучшиться. Это как иметь персонального репетитора.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Дизайнер продукта",
    initials: "DK",
    quote:
      "Система геймификации поддерживает меня в мотивации. Я поддерживаю 30-дневную учебную серию благодаря ежедневным вызовам и системе достижений.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Отзывы</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Любимые студентами со всего мира
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/50 bg-card">
              <CardContent className="p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {'"'}{t.quote}{'"'}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
