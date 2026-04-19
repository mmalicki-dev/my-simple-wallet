export interface Account {
  _id: string;
  user: string;
  name: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  name: string;
  currency: string;
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
