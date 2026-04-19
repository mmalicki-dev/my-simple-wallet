export type RecurringPaymentType = "subscription" | "loan";
export type BillingCycle = "weekly" | "monthly" | "yearly";

export interface RecurringPayment {
  _id: string;
  account: string;
  category: string;
  name: string;
  amount: number;
  type: RecurringPaymentType;
  billingCycle: BillingCycle;
  nextDueDate: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringPaymentRequest {
  name: string;
  type: RecurringPaymentType;
  amount: number;
  account: string;
  category: string;
  billingCycle: BillingCycle;
  nextDueDate: string;
  description?: string;
}

export interface UpdateRecurringPaymentRequest {
  id: string;
  body: {
    name?: string;
    type?: RecurringPaymentType;
    amount?: number;
    account?: string;
    category?: string;
    billingCycle?: BillingCycle;
    nextDueDate?: string;
    description?: string;
    isActive?: boolean;
  };
}

export interface DeleteRecurringPaymentRequest {
  id: string;
}
