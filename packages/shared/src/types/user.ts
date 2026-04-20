import type { Currency } from './currency'

export interface User {
  id: string
  email: string
  name: string
  totalBalanceCurrency: Currency
  createdAt: string
  updatedAt: string
}

export interface AuthTokenPayload {
  userId: string
  email: string
}
