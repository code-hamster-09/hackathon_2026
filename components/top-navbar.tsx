"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, X } from "lucide-react"
import { useState } from "react"

export function TopNavbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search courses, lessons..."
              className="h-9 w-64 bg-secondary"
              autoFocus
            />
          </div>

        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  )
}
