import type { Currency } from "./currency.js";

export interface User {
  id: string;
  email: string;
  name: string;
  totalBalanceCurrency: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}
