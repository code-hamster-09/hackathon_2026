"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { currentUser } from "@/lib/mock-data";

type ProfileState = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  loading: boolean;
};

const defaultState: ProfileState = {
  firstName: null,
  lastName: null,
  avatarUrl: null,
  loading: true,
};

type ProfileContextValue = ProfileState & {
  displayName: string;
  /** Имя для отображения везде (только имя, без фамилии) */
  firstNameDisplay: string;
  initials: string;
  refresh: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProfileState>(defaultState);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", user.id)
      .single();
    setState({
      firstName: data?.first_name ?? user.user_metadata?.first_name ?? null,
      lastName: data?.last_name ?? user.user_metadata?.last_name ?? null,
      avatarUrl: data?.avatar_url ?? null,
      loading: false,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayName =
    [state.firstName, state.lastName].filter(Boolean).join(" ").trim() ||
    currentUser.name;
  const firstNameDisplay =
    state.firstName?.trim() ||
    displayName.split(" ")[0] ||
    currentUser.name.split(" ")[0] ||
    currentUser.name;
  const initials =
    [state.firstName, state.lastName]
      .filter(Boolean)
      .map((s) => (s ?? "")[0])
      .join("")
      .toUpperCase() || currentUser.initials;

  const value: ProfileContextValue = {
    ...state,
    displayName,
    firstNameDisplay,
    initials,
    refresh: load,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    return {
      ...defaultState,
      displayName: currentUser.name,
      firstNameDisplay: currentUser.name.split(" ")[0] || currentUser.name,
      initials: currentUser.initials,
      refresh: async () => {},
    };
  }
  return ctx;
}
