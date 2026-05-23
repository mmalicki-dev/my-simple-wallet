import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';

interface AuthTabsProps {
  currentTab: 'login' | 'register';
  onPress: (tab: 'login' | 'register') => void;
}

export const AuthTabs = ({ currentTab, onPress }: AuthTabsProps) => {
  const colors = useColors();

  return (
    <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
      {(['login', 'register'] as const).map((tab) => {
        const active = currentTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { borderBottomColor: active ? colors.neon : 'transparent' }]}
            onPress={() => onPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, { color: active ? colors.neon : colors.textMuted }]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    marginBottom: -1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
