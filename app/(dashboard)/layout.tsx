"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 flex-1 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
