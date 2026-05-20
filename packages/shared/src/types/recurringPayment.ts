export const RECURRING_PAYMENT_TYPES = ['loan', 'subscription'] as const

export type RecurringPaymentType = (typeof RECURRING_PAYMENT_TYPES)[number]

export const BILLING_CYCLES = ['weekly', 'monthly', 'yearly'] as const

export type BillingCycle = (typeof BILLING_CYCLES)[number]

export interface RecurringPayment {
  _id: string
  account: string
  category: string
  name: string
  amount: number
  type: RecurringPaymentType
  billingCycle: BillingCycle
  nextDueDate: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRecurringPaymentRequest {
  name: string
  type: RecurringPaymentType
  amount: number
  account: string
  category: string
  billingCycle: BillingCycle
  nextDueDate: string
  description?: string
}

export interface UpdateRecurringPaymentRequest {
  id: string
  body: {
    name?: string
    type?: RecurringPaymentType
    amount?: number
    account?: string
    category?: string
    billingCycle?: BillingCycle
    nextDueDate?: string
    description?: string
    isActive?: boolean
  }
}

export interface DeleteRecurringPaymentRequest {
  id: string
}
