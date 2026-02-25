import { Brain, BarChart3, Target, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Get personalized course suggestions and study plans powered by machine learning that adapts to your learning style.",
  },
  {
    icon: Target,
    title: "Progress Tracking",
    description: "Visual dashboards and milestone tracking to keep you motivated and on track toward your learning goals.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Deep insights into your performance, study patterns, and areas for improvement with actionable data.",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Ask questions, get explanations, and receive guidance from an intelligent assistant that understands your courses.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Everything you need to accelerate learning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Powerful tools designed to make education more effective, engaging, and personalized for every learner.
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
