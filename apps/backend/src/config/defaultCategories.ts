import { CategoryIconName, TransactionType } from "shared";

interface DefaultCategory {
  name: string;
  type: TransactionType;
  icon: CategoryIconName;
  colour: string;
  isDefault: true;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Income
  {
    name: "Salary",
    type: "income",
    icon: "briefcase",
    colour: "#4CAF50",
    isDefault: true,
  },
  {
    name: "Freelance",
    type: "income",
    icon: "laptop",
    colour: "#8BC34A",
    isDefault: true,
  },
  {
    name: "Investment",
    type: "income",
    icon: "graph-up",
    colour: "#009688",
    isDefault: true,
  },
  {
    name: "Gift",
    type: "income",
    icon: "gift",
    colour: "#00BCD4",
    isDefault: true,
  },
  {
    name: "Other Income",
    type: "income",
    icon: "add-circle",
    colour: "#03A9F4",
    isDefault: true,
  },

  // Expense
  {
    name: "Food & Drink",
    type: "expense",
    icon: "utensils",
    colour: "#FF5722",
    isDefault: true,
  },
  {
    name: "Transport",
    type: "expense",
    icon: "wheel",
    colour: "#FF9800",
    isDefault: true,
  },
  {
    name: "Housing",
    type: "expense",
    icon: "house",
    colour: "#FFC107",
    isDefault: true,
  },
  {
    name: "Health",
    type: "expense",
    icon: "heart",
    colour: "#F44336",
    isDefault: true,
  },
  {
    name: "Shopping",
    type: "expense",
    icon: "shopping-cart",
    colour: "#E91E63",
    isDefault: true,
  },
  {
    name: "Entertainment",
    type: "expense",
    icon: "tv",
    colour: "#9C27B0",
    isDefault: true,
  },
  {
    name: "Education",
    type: "expense",
    icon: "book",
    colour: "#673AB7",
    isDefault: true,
  },
  {
    name: "Subscriptions",
    type: "expense",
    icon: "repeat",
    colour: "#3F51B5",
    isDefault: true,
  },
  {
    name: "Other Expense",
    type: "expense",
    icon: "minus-circle",
    colour: "#607D8B",
    isDefault: true,
  },
];
