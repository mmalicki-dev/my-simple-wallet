export const ICON_NAMES = [
  "tv",
  "repeat",
  "logout",
  "add-circle",
  "minus-circle",
  "pen-edit-round",
  "wheel",
  "tram",
  "sun-sea",
  "wallet",
  "wad-of-money",
  "dashboard",
  "confirm",
  "suitcase",
  "sale",
  "restart",
  "chart-pie",
  "laptop",
  "list-arrow-down",
  "chart-bar-2",
  "course-up",
  "course-down",
  "chart-bar",
  "diagram-up",
  "diagram-down",
  "dollar-circle",
  "gamepad",
  "graph-up",
  "heart-pulse",
  "cash-out",
  "shopping-cart",
  "book-2",
  "balls",
  "arrow-up",
  "arrow-right",
  "arrow-left",
  "arrow-down",
  "wineglass",
  "adhesive-plaster",
  "camera",
  "confetti",
  "donut",
  "eye-open",
  "eye-closed",
  "gift",
  "hand-money",
  "house",
  "trash-bin",
  "user-id",
  "bell-bing",
  "balloon",
  "album",
  "heart",
  "briefcase",
  "book",
  "fastfood",
  "utensils",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const CATEGORY_ICON_NAMES = [
  // Income
  "briefcase",
  "wad-of-money",
  "hand-money",
  "graph-up",
  "sale",

  // Housing & bills
  "house",
  "repeat",

  // Food & drinks
  "utensils",
  "fastfood",
  "donut",
  "wineglass",

  // Shopping
  "shopping-cart",

  // Transport
  "wheel",
  "tram",

  // Health
  "heart-pulse",
  "adhesive-plaster",

  // Entertainment & hobbies
  "tv",
  "gamepad",
  "album",
  "book",
  "balls",
  "camera",

  // Travel
  "sun-sea",
  "suitcase",

  // Tech
  "laptop",

  // Gifts & celebrations
  "gift",
  "balloon",
  "confetti",

  // Other
  "heart",
] as const satisfies readonly IconName[];

export type CategoryIconName = (typeof CATEGORY_ICON_NAMES)[number];
