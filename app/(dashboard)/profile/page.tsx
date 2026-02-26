"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TopNavbar } from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { currentUser, courses } from "@/lib/mock-data";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { useProfile } from "@/lib/profile-context";
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
  Upload,
  ImageIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { refresh: refreshProfile } = useProfile();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { firstNameDisplay } = useProfile();
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
          if (error && error.code !== "PGRST116") {
            console.error("Profile load error:", error.message || error.code || String(error));
          }
          if (data) {
            setProfile(data as ProfileRow);
            setFirstName(data.first_name ?? "");
            setLastName(data.last_name ?? "");
            setAvatarUrl(data.avatar_url ?? "");
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
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    setSaving(false);
    if (error) {
      console.error("Profile save error:", error.message || error.code || String(error));
    } else {
      setProfile((p) => (p ? { ...p, first_name: firstName.trim() || null, last_name: lastName.trim() || null, avatar_url: avatarUrl.trim() || null } : null));
      refreshProfile();
    }
  }

  function openAvatarModal() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
    setAvatarModalOpen(true);
  }

  function onAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type) || file.size > 2 * 1024 * 1024) {
      setAvatarError("Формат: JPG, PNG, WebP или GIF, не более 2 МБ");
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setAvatarError(null);
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function handleAvatarUpload() {
    const supabase = getSupabaseBrowser();
    if (!supabase || !avatarFile) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setAvatarUploading(true);
    setAvatarError(null);

    const ensureRes = await fetch("/api/storage/ensure-avatars", { method: "POST" });
    if (!ensureRes.ok) {
      const body = await ensureRes.json().catch(() => ({}));
      const msg =
        body?.error === "missing_service_role"
          ? body?.message || "Настройте SUPABASE_SERVICE_ROLE_KEY или создайте бакет avatars в Supabase Dashboard (Storage → New bucket)."
          : body?.message || body?.error || "Не удалось подготовить хранилище.";
      setAvatarError(msg);
      setAvatarUploading(false);
      return;
    }

    const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });
    if (uploadError) {
      setAvatarError(uploadError.message || "Ошибка загрузки");
      setAvatarUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newUrl = urlData.publicUrl;
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          avatar_url: newUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    setAvatarUploading(false);
    if (profileError) {
      setAvatarError(profileError.message || "Ошибка сохранения");
      return;
    }
    setAvatarUrl(newUrl);
    setProfile((p) => (p ? { ...p, avatar_url: newUrl } : null));
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarModalOpen(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    refreshProfile();
  }

  function closeAvatarModal() {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarModalOpen(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
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
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
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
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="" className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <h2 className="text-2xl font-bold text-foreground">{firstNameDisplay}</h2>
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
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Аватар</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit gap-2"
                    onClick={openAvatarModal}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4" />
                    Загрузить фото
                  </Button>
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

      <Dialog open={avatarModalOpen} onOpenChange={(open) => !open && closeAvatarModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Загрузить аватар</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={onAvatarFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="flex flex-col gap-2 py-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm">
                {avatarFile ? "Выбрать другой файл" : "Выберите изображение (JPG, PNG, WebP, GIF до 2 МБ)"}
              </span>
            </Button>
            {avatarPreview && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">Превью:</p>
                <img
                  src={avatarPreview}
                  alt="Превью"
                  className="h-32 w-32 rounded-full object-cover border border-border"
                />
              </div>
            )}
            {avatarError && (
              <p className="text-sm text-destructive">{avatarError}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeAvatarModal}>
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleAvatarUpload}
              disabled={!avatarFile || avatarUploading}
            >
              {avatarUploading ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
