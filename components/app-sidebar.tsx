"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Trophy,
  MessageSquare,
  User,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/lib/profile-context";
import { currentUser } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/courses", label: "Курсы", icon: BookOpen },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/gamification", label: "Достижения", icon: Trophy },
  { href: "/assistant", label: "ИИ Помощник", icon: MessageSquare },
  { href: "/profile", label: "Профиль", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { firstNameDisplay, initials, avatarUrl } = useProfile();

  const xpPercent = Math.round((currentUser.xp / currentUser.xpToNext) * 100);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card transition-all duration-300 md:flex"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">EduFlow</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt=""
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{firstNameDisplay}</p>
            <p className="text-xs text-muted-foreground">
              Level {currentUser.level}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">XP Progress</span>
            <span className="text-xs font-medium text-primary">
              {currentUser.xp}/{currentUser.xpToNext}
            </span>
          </div>
          <Progress value={xpPercent} className="h-1.5" />
        </div>
      </div>
    </aside>
  );
}
