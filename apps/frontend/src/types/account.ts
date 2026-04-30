import type { Currency } from 'shared'

export interface Account {
  _id: string;
  user: string;
  name: string;
  balance: number;
  currency: Currency;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  name: string;
  currency: Currency;
}

export interface UpdateAccountRequest {
  id: string;
  body: {
    name?: string;
    currency?: string;
    isDefault?: boolean;
  };
}

export interface DeleteAccountRequest {
  id: string;
}
