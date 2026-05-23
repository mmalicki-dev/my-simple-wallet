import { useTheme } from './useTheme';
import { palette } from '@/theme/colors';

export const useColors = () => {
  const { theme } = useTheme();
  return palette[theme];
};
