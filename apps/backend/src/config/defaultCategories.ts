import { CategoryType } from '../models/Category.js'

interface DefaultCategory {
  name: string
  type: CategoryType
  icon: string
  color: string
  isDefault: true
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Income
  { name: 'Salary', type: 'income', icon: 'briefcase', color: '#4CAF50', isDefault: true },
  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#8BC34A', isDefault: true },
  { name: 'Investment', type: 'income', icon: 'trending-up', color: '#009688', isDefault: true },
  { name: 'Gift', type: 'income', icon: 'gift', color: '#00BCD4', isDefault: true },
  { name: 'Other Income', type: 'income', icon: 'plus-circle', color: '#03A9F4', isDefault: true },

  // Expense
  { name: 'Food & Drink', type: 'expense', icon: 'utensils', color: '#FF5722', isDefault: true },
  { name: 'Transport', type: 'expense', icon: 'car', color: '#FF9800', isDefault: true },
  { name: 'Housing', type: 'expense', icon: 'home', color: '#FFC107', isDefault: true },
  { name: 'Health', type: 'expense', icon: 'heart', color: '#F44336', isDefault: true },
  { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#E91E63', isDefault: true },
  { name: 'Entertainment', type: 'expense', icon: 'tv', color: '#9C27B0', isDefault: true },
  { name: 'Education', type: 'expense', icon: 'book', color: '#673AB7', isDefault: true },
  { name: 'Subscriptions', type: 'expense', icon: 'repeat', color: '#3F51B5', isDefault: true },
  { name: 'Other Expense', type: 'expense', icon: 'minus-circle', color: '#607D8B', isDefault: true },
]
