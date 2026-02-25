import { createSlice } from "@reduxjs/toolkit"
import type { User } from "@supabase/supabase-js"
import { authApi } from "../api/authApi"

export type AuthState = {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: { payload: User | null }) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = action.payload.user
      })
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
