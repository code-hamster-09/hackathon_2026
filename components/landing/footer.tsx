import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">EduFlow</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-center md:justify-end md:gap-8">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Возможности
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Цены
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              О нас
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Контакты
            </Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            2026 EduFlow. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
