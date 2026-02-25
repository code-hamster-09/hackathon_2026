"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AppSidebar />
      <main className="flex-1 pb-16 md:ml-64 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
