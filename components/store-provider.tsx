"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { setUser } from "@/store/slices/authSlice"
import { supabaseBrowser } from "@/lib/supabase-client"

function AuthHydrate() {
  useEffect(() => {
    // Get initial session from Supabase
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        store.dispatch(setUser(session.user))
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setUser(session?.user ?? null))
    })

    return () => subscription.unsubscribe()
  }, [])
  return null
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrate />
      {children}
    </Provider>
  )
}
