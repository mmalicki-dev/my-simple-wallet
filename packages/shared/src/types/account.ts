import type { Currency } from './currency.js'
import type { AccountType } from '../schemas/accounts.js'

export interface Account {
  _id: string
  user: string
  name: string
  type: AccountType
  balance: number
  currency: Currency
  isDefault: boolean
  includeInTotal: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAccountRequest {
  name: string
  currency: Currency
  type?: AccountType
  includeInTotal?: boolean
}

export interface UpdateAccountRequest {
  id: string
  body: {
    name?: string
    currency?: string
    isDefault?: boolean
    type?: AccountType
    includeInTotal?: boolean
  }
}

export interface DeleteAccountRequest {
  id: string
}
