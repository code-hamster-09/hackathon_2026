"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TopNavbar } from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { currentUser, courses } from "@/lib/mock-data";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import type { ProfileRow } from "@/lib/questionnaire-types";
import {
  BookOpen,
  Clock,
  Trophy,
  Flame,
  Star,
  Calendar,
  Mail,
  Bell,
  Moon,
  Globe,
  ClipboardList,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const xpPercent = Math.round((currentUser.xp / currentUser.xpToNext) * 100);
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const questionnaireCompleted = !!profile?.questionnaire_completed_at;

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email ?? "");
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== "PGRST116") console.error(error);
          if (data) {
            setProfile(data as ProfileRow);
            setFirstName(data.first_name ?? "");
            setLastName(data.last_name ?? "");
          } else {
            setFirstName(user.user_metadata?.first_name ?? "");
            setLastName(user.user_metadata?.last_name ?? "");
          }
          setLoading(false);
        });
    });
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    setSaving(false);
    if (error) console.error(error);
    else setProfile((p) => (p ? { ...p, first_name: firstName.trim() || null, last_name: lastName.trim() || null } : null));
  }

  const displayName =
    [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || currentUser.name;
  const initials =
    [firstName.trim(), lastName.trim()]
      .filter(Boolean)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || currentUser.initials;

  const stats = [
    { icon: BookOpen, label: "Courses Completed", value: String(completedCourses) },
    { icon: Clock, label: "Study Hours", value: `${currentUser.totalHours}h` },
    { icon: Trophy, label: "Total Points", value: currentUser.points.toLocaleString() },
    { icon: Flame, label: "Day Streak", value: String(currentUser.streak) },
    { icon: Star, label: "Level", value: String(currentUser.level) },
    { icon: Calendar, label: "Member Since", value: "Sep 2025" },
  ];

  return (
    <div className="flex flex-col">
      <TopNavbar title="Profile" />
      <div className="flex flex-col gap-6 p-6">
        {!questionnaireCompleted && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">
                Пройдите опросник персонализации — так AI-ассистент сможет объяснять темы под ваш стиль
                обучения.
              </p>
              <Button asChild variant="default" className="gap-2 shrink-0">
                <Link href="/onboarding">
                  <ClipboardList className="h-4 w-4" />
                  Пройти опросник
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                    Level {currentUser.level}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{email}</p>
                <div className="mt-4 max-w-sm">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">XP to Level {currentUser.level + 1}</span>
                    <span className="font-medium text-primary">
                      {currentUser.xp}/{currentUser.xpToNext}
                    </span>
                  </div>
                  <Progress value={xpPercent} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-2 text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Личные данные
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Имя</Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-secondary/50"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Фамилия</Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-secondary/50"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Email</Label>
                  <Input value={email} readOnly className="bg-muted/50" />
                </div>
                <Button type="submit" disabled={saving || loading} className="mt-2 w-fit font-medium">
                  {saving ? "Сохранение…" : "Сохранить изменения"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Настройки</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Уведомления</p>
                    <p className="text-xs text-muted-foreground">Напоминания о дедлайнах</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email-дайджест</p>
                    <p className="text-xs text-muted-foreground">Итоги за неделю</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Moon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Тёмная тема</p>
                    <p className="text-xs text-muted-foreground">Скоро</p>
                  </div>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Язык</p>
                    <p className="text-xs text-muted-foreground">Русский</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  RU
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
