export const palette = {
  light: {
    neon: "#328cff",
    bg: "#ececec",
    surface: "#e4e4ff",
    text: "#18181b",
    textMuted: "#71717a",
    border: "#e4e4e7",
    danger: "#c62828",
    success: "#2e7d32",
    primary: "#3949ab",
    accountDebit: "#9e9e9e",
    accountCredit: "#b45309",
  },
  dark: {
    neon: "#bc13fe",
    bg: "#09090b",
    surface: "#18181b",
    text: "#fafafa",
    textMuted: "#a1a1aa",
    border: "#27272a",
    danger: "#ef5350",
    success: "#66bb6a",
    primary: "#7986cb",
    accountDebit: "#71717a",
    accountCredit: "#d97706",
  },
} as const;

export type ColorScheme = typeof palette.light;

export function alpha(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.substring(0, 2), 16);
  const g = Number.parseInt(h.substring(2, 4), 16);
  const b = Number.parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
