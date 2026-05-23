import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import { useColors } from '@/hooks';
import { alpha } from '@/theme/colors';

interface NeonButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'danger';
}

export const NeonButton = ({ label, loading, variant = 'primary', style, ...props }: NeonButtonProps) => {
  const colors = useColors();
  const color = variant === 'danger' ? colors.danger : colors.neon;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: alpha(color, 0.18) }, style]}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={color} size="small" />
      ) : (
        <Text style={[styles.label, { color }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
