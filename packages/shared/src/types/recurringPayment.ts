export const RECURRING_PAYMENT_TYPES = ['loan', 'subscription'] as const

export type RecurringPaymentType = (typeof RECURRING_PAYMENT_TYPES)[number]

export const BILLING_CYCLES = ['weekly', 'monthly', 'yearly'] as const

export type BillingCycle = (typeof BILLING_CYCLES)[number]
