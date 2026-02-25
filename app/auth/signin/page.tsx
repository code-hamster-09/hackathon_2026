"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLoginMutation } from "@/store/api/authApi"

export default function SignInPage() {
  const router = useRouter()
  const [login, { isLoading, error }] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    const email = (formData.get("email") as string)?.trim()
    const password = formData.get("password") as string

    if (!email || !password) {
      setErrorMessage("Введите email и пароль")
      return
    }

    try {
      await login({ email, password }).unwrap()
      router.push("/dashboard")
    } catch (err: unknown) {
      const message = err && typeof err === "object" && err !== null && "data" in err && typeof (err as { data: unknown }).data === "string"
        ? (err as { data: string }).data
        : "Ошибка входа"
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
            <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Sign in to continue your learning journey
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="alex@example.com"
                className="h-11 bg-secondary/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-11 bg-secondary/50"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="mt-2 h-11 font-semibold shadow-lg shadow-primary/25">
              {isLoading ? "Вход…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
