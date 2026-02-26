"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRegisterMutation } from "@/store/api/authApi"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function SignUpPage() {
  const router = useRouter()
  const [register, { isLoading, error }] = useRegisterMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    const firstName = (formData.get("firstName") as string)?.trim()
    const lastName = (formData.get("lastName") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const password = formData.get("password") as string

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("Заполните все поля")
      return
    }
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasDigit = /\d/.test(password)
    if (!hasUpper || !hasLower || !hasDigit) {
      setErrorMessage("Пароль должен содержать заглавные и строчные буквы и цифры")
      return
    }

    try {
      await register({ firstName, lastName, email, password }).unwrap()
      // If email confirmation is required, Supabase won't return a session
      const { data } = await supabaseBrowser.auth.getSession()
      if (data.session) {
        router.push("/onboarding")
      } else {
        router.push("/auth/signin")
      }
    } catch (err: unknown) {
      const message = err && typeof err === "object" && err !== null && "data" in err && typeof (err as { data: unknown }).data === "string"
        ? (err as { data: string }).data
        : "Ошибка регистрации"
      setErrorMessage(message)
    }
  }

  const displayError = errorMessage ?? (error && typeof error === "object" && error !== null && "data" in error && typeof (error as { data: unknown }).data === "string" ? (error as { data: string }).data : null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md border-border/50 bg-card shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="mx-auto flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduFlow</span>
          </Link>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Создайте ваш аккаунт</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Начните ваше персонализированное обучение сегодня
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {displayError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {displayError}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName" className="text-foreground">Имя</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Имя"
                  className="h-11 bg-secondary/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName" className="text-foreground">Фамилия</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Фамилия"
                  className="h-11 bg-secondary/50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">Email адрес</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="h-11 bg-secondary/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-foreground">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Придумайте надёжный пароль"
                  className="h-11 pr-10 bg-secondary/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-10 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Пароль должен содержать заглавные и строчные буквы и цифры
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="mt-2 h-11 font-semibold shadow-lg shadow-primary/25">
              {isLoading ? "Создание…" : "Создать аккаунт"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
