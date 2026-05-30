import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useColors } from '@/hooks';
import { alpha } from '@/theme/colors';

interface FormInputProps extends TextInputProps {
  label: string;
}

export const FormInput = ({ label, style, ...props }: FormInputProps) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: alpha(colors.surface, 0.7),
            borderBottomColor: focused ? colors.neon : colors.border,
            borderLeftColor: focused ? colors.neon : 'transparent',
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderLeftWidth: 2,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
