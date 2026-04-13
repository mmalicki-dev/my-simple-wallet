import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from 'shared'
import { StorageService } from '../../services/storage'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: StorageService.getToken() ?? null,
  isAuthenticated: !!StorageService.getToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      StorageService.setToken(action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      StorageService.removeToken()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
