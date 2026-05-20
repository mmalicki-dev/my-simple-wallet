import type { TransactionType } from './transaction.js'

export interface Category {
  _id: string
  name: string
  type: TransactionType
  icon: string
  colour: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  type: TransactionType
  icon?: string
  colour?: string
}

export interface UpdateCategoryRequest {
  id: string
  body: {
    name?: string
    type?: TransactionType
    icon?: string
    colour?: string
  }
}

export interface DeleteCategoryRequest {
  id: string
}
