export const RECURRING_PAYMENT_TYPES = ['loan', 'subscription'] as const

export type RecurringPaymentType = (typeof RECURRING_PAYMENT_TYPES)[number]
