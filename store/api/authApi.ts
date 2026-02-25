import { createApi } from "@reduxjs/toolkit/query/react"
import { supabaseBrowser } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

export type LoginArgs = { email: string; password: string }
export type LoginResult = { user: User }

export type RegisterArgs = {
  firstName: string
  lastName: string
  email: string
  password: string
}
export type RegisterResult = { user: User }

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: () => ({ data: null }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginArgs>({
      queryFn: async (arg) => {
        const { data, error } = await supabaseBrowser.auth.signInWithPassword({
          email: arg.email,
          password: arg.password,
        })
        if (error) {
          return {
            error: {
              status: 401 as number,
              data: error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message,
            },
          }
        }
        if (!data.user) {
          return { error: { status: 401 as number, data: "Нет сессии" } }
        }
        return { data: { user: data.user } }
      },
    }),

    register: builder.mutation<RegisterResult, RegisterArgs>({
      queryFn: async (arg) => {
        const { data, error } = await supabaseBrowser.auth.signUp({
          email: arg.email,
          password: arg.password,
          options: {
            data: { first_name: arg.firstName, last_name: arg.lastName },
          },
        })
        if (error) {
          return { error: { status: 400 as number, data: error.message } }
        }
        if (!data.user) {
          return { error: { status: 400 as number, data: "Ошибка регистрации" } }
        }
        return { data: { user: data.user } }
      },
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = authApi
