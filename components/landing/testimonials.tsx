import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Jordan Lee",
    role: "Software Engineer",
    initials: "JL",
    quote:
      "EduFlow's AI recommendations helped me transition from frontend to full-stack in just 3 months. The personalized learning paths are incredible.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Data Analyst",
    initials: "MS",
    quote:
      "The analytics dashboard gives me clear insights into where I'm excelling and where I need to improve. It's like having a personal tutor.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Product Designer",
    initials: "DK",
    quote:
      "The gamification system keeps me motivated. I've maintained a 30-day learning streak thanks to the daily challenges and achievement system.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Loved by learners worldwide
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
