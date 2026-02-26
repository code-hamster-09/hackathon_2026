"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ProfileProvider } from "@/lib/profile-context"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProfileProvider>
      <div className="flex min-h-screen flex-col bg-background md:flex-row">
        <AppSidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden pb-16 md:ml-64 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </ProfileProvider>
  )
}
