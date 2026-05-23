import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@/components/atoms/Icon/Icon";
import { NavItem } from "@/components/molecules/NavItem/NavItem";
import { useColors, useAppDispatch } from "@/hooks";
import { alpha } from "@/theme/colors";
import { useLogoutMutation } from "@/services/authApi";
import { logout } from "@/redux/slices/authSlice";
import { api } from "@/redux/api";
import type { RootStackParamList } from "@/navigation";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const FAB_SIZE = 52;

export const Navigation = () => {
  const colors = useColors();
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const [fabActive, setFabActive] = useState(false);

  const go = (screen: keyof RootStackParamList) => navigation.navigate(screen);

  const handleLogout = async () => {
    await logoutMutation().catch(() => {});
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <View
      style={[
        styles.nav,
        {
          borderTopColor: colors.neon,
          backgroundColor: alpha(colors.neon, 0.18),
          shadowColor: colors.neon,
        },
      ]}
    >
      <NavItem
        icon="dashboard"
        label="Home"
        active={route.name === "Home"}
        onPress={() => go("Home")}
      />
      <NavItem
        icon="chart-bar-2"
        label="Charts"
        active={route.name === "Charts"}
        onPress={() => go("Charts")}
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
        active={route.name === "User"}
        onPress={() => go("User")}
      />
      <NavItem icon="logout" label="Logout" active={false} onPress={handleLogout} />
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
    elevation: 8,
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
