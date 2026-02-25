export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Create your profile",
      description:
        "Sign up and tell us about your learning goals, interests, and preferred pace. Our AI builds a personalized roadmap.",
    },
    {
      step: "02",
      title: "Follow AI-guided paths",
      description:
        "Get smart recommendations for courses, lessons, and practice exercises that match your skill level and goals.",
    },
    {
      step: "03",
      title: "Track and achieve",
      description:
        "Monitor your progress with detailed analytics, earn achievements, and watch your skills grow over time.",
    },
  ]

  return (
    <section className="bg-secondary/50 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Start learning in 3 simple steps
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
