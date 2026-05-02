import { TransactionType, TransactionStatus } from "shared";

export interface Transaction {
  _id: string;
  account: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
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
  accountId?: string;
  from?: string;
  to?: string;
}
