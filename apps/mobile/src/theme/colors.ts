export const palette = {
  light: {
    neon: '#328cff',
    bg: '#ececec',
    surface: '#e4e4ff',
    text: '#18181b',
    textMuted: '#71717a',
    border: '#e4e4e7',
    danger: '#c62828',
    success: '#2e7d32',
  },
  dark: {
    neon: '#bc13fe',
    bg: '#09090b',
    surface: '#18181b',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    border: '#27272a',
    danger: '#ef5350',
    success: '#66bb6a',
  },
} as const;

export type ColorScheme = typeof palette.light;

export function alpha(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
