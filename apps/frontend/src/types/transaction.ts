import { TransactionType } from "shared";

export interface Transaction {
  _id: string;
  account: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  account: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
}

export interface UpdateTransactionRequest {
  id: string;
  body: {
    account?: string;
    amount?: number;
    type?: TransactionType;
    category?: string;
    description?: string;
    date?: string;
  };
}

export interface DeleteTransactionRequest {
  id: string;
}

export interface GetTransactionsRequest {
  from?: string;
  to?: string;
}
