export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Создайте свой профиль",
      description:
        "Зарегистрируйтесь и расскажите нам о ваших целях обучения, интересах и предпочитаемом темпе. Наш ИИ создаёт персонализированный учебный план.",
    },
    {
      step: "02",
      title: "Следуйте путям, направленным ИИ",
      description:
        "Получайте умные рекомендации для курсов, уроков и практических упражнений, которые соответствуют вашему уровню и целям.",
    },
    {
      step: "03",
      title: "Отслеживайте и достигайте",
      description:
        "Отслеживайте свой прогресс с детальными аналитическими данными, получайте достижения и наблюдайте за ростом ваших навыков с течением времени.",
    },
  ]

  return (
    <section className="bg-secondary/50 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Как это работает</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Начать обучение за 3 простых шага
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
