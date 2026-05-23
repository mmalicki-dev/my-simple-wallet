import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@/components/atoms/Icon/Icon";
import { NavItem } from "@/components/molecules/NavItem/NavItem";
import { useColors, useAppDispatch } from "@/hooks";
import { alpha } from "@/theme/colors";
import { useLogoutMutation } from "@/services/authApi";
import { logout } from "@/redux/slices/authSlice";
import { api } from "@/redux/api";
import type { RootStackParamList } from "@/navigation";

const FAB_SIZE = 52;

export const Navigation = ({
  state,
  navigation,
  insets,
}: BottomTabBarProps) => {
  const colors = useColors();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const [fabActive, setFabActive] = useState(false);

  const activeRouteName = state.routes[state.index]?.name ?? "";

  const goTo = (routeName: string) => navigation.navigate(routeName);

  const handleLogout = async () => {
    await logoutMutation().catch(() => {});
    dispatch(logout());
    dispatch(api.util.resetApiState());
    const parentNav =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    parentNav?.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <View
      style={[
        styles.nav,
        {
          paddingBottom: insets.bottom,
          borderTopColor: colors.neon,
          backgroundColor: alpha(colors.neon, 0.18),
          shadowColor: colors.neon,
        },
      ]}
    >
      <NavItem
        icon="dashboard"
        label="Home"
        active={activeRouteName === "Home"}
        onPress={() => goTo("Home")}
      />
      <NavItem
        icon="chart-bar-2"
        label="Charts"
        active={activeRouteName === "Charts"}
        onPress={() => goTo("Charts")}
      />

      <View style={styles.fabSlot}>
        <TouchableOpacity
          style={[
            styles.fab,
            fabActive && styles.fabActive,
            {
              backgroundColor: colors.surface,
              borderColor: colors.neon,
              shadowColor: colors.neon,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => setFabActive((v) => !v)}
        >
          <Icon name="add-circle" size={28} color={colors.neon} />
        </TouchableOpacity>
      </View>

      <NavItem
        icon="user-id"
        label="User"
        active={activeRouteName === "User"}
        onPress={() => goTo("User")}
      />
      <NavItem
        icon="logout"
        label="Logout"
        active={false}
        onPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    overflow: "visible",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  fabSlot: {
    flex: 1,
    alignItems: "center",
    overflow: "visible",
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -(FAB_SIZE / 2) }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
  fabActive: {
    transform: [{ translateY: -(FAB_SIZE / 2) }, { rotate: "45deg" }],
  },
});
