export const ICON_NAMES = [
  'briefcase',
  'laptop',
  'trending-up',
  'gift',
  'plus-circle',
  'utensils',
  'car',
  'home',
  'heart',
  'shopping-bag',
  'tv',
  'book',
  'repeat',
  'minus-circle',
  'dashboard',
  'chart',
  'user-edit',
  'logout',
] as const

export type IconName = (typeof ICON_NAMES)[number]

export const CATEGORY_ICON_NAMES = [
  'briefcase',
  'laptop',
  'trending-up',
  'gift',
  'plus-circle',
  'utensils',
  'car',
  'home',
  'heart',
  'shopping-bag',
  'tv',
  'book',
  'repeat',
  'minus-circle',
] as const satisfies readonly IconName[]

export type CategoryIconName = (typeof CATEGORY_ICON_NAMES)[number]
