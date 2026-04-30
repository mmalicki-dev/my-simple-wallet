export const CURRENCIES = ['NOK', 'PLN', 'EUR', 'USD', 'GBP'] as const

export type Currency = (typeof CURRENCIES)[number]
