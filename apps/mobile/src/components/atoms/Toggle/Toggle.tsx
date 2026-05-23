import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';
import { alpha } from '@/theme/colors';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export const Toggle = ({ options, value, onChange }: ToggleProps) => {
  const colors = useColors();

  return (
    <View style={styles.toggle}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.btn,
              { borderBottomColor: active ? colors.neon : 'transparent' },
              active && { backgroundColor: alpha(colors.neon, 0.08) },
            ]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, { color: active ? colors.text : colors.textMuted }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
