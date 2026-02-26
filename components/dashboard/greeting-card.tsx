"use client";

import { useProfile } from "@/lib/profile-context";
import { currentUser } from "@/lib/mock-data";
import { Flame, BookOpen, Clock } from "lucide-react";

export function GreetingCard() {
  const { firstNameDisplay } = useProfile();

  return (
    <div className="rounded-2xl bg-primary p-4 text-primary-foreground sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
          С возвращением, {firstNameDisplay}
          </h2>
          <p className="mt-1 text-primary-foreground/80">
          Вы уже {currentUser.streak}-дней подряд. Продолжайте в том же духе!
          </p>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentUser.streak}</p>
              <p className="text-xs text-primary-foreground/70">Day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentUser.coursesInProgress}</p>
              <p className="text-xs text-primary-foreground/70">In progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentUser.totalHours}h</p>
              <p className="text-xs text-primary-foreground/70">Total hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
