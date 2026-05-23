import { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';
import { alpha } from '@/theme/colors';

interface GlassWrapperProps {
  children: ReactNode;
}

export const GlassWrapper = ({ children }: GlassWrapperProps) => {
  const colors = useColors();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: alpha(colors.neon, 0.08),
          borderColor: alpha(colors.neon, 0.22),
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 32,
    borderWidth: 1,
    borderRadius: 4,
    gap: 20,
  },
});
