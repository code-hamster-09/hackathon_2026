import { Brain, BarChart3, Target, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "Рекомендации ИИ",
    description: "Получайте персонализированные предложения курсов и учебных планов, работающих на основе машинного обучения, которые адаптируются к вашему стилю обучения.",
  },
  {
    icon: Target,
    title: "Отслеживание прогресса",
    description: "Визуальные дашборды и отслеживание достижений, чтобы поддерживать вас мотивированным и на пути к вашим целям обучения.",
  },
  {
    icon: BarChart3,
    title: "Умные аналитики",
    description: "Глубокие аналитические данные о вашей производительности, паттернах обучения и областях для улучшения с действенными данными.",
  },
  {
    icon: MessageSquare,
    title: "ИИ Помощник",
    description: "Задавайте вопросы, получайте объяснения и получайте помощь от интеллектуального помощника, который понимает ваши курсы.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Возможности</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Все, что вам нужно для ускорения обучения
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Мощные инструменты, разработанные для более эффективного, увлекательного и персонализированного обучения для каждого студента.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
