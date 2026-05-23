import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BackgroundGrid } from "@/components/atoms/BackgroundGrid/BackgroundGrid";
import { useColors, useAppSelector } from "@/hooks";
import AuthScreen from "../screens/AuthScreen/Auth";
import ProfileScreen from "../screens/ProfileScreen/Profile";
import AccountsScreen from "../screens/AccountsScreen/Accounts";
import CategoriesScreen from "../screens/CategoriesScreen/Categories";
import RecurringScreen from "../screens/RecurringScreen/Recurring";
import VerifyEmailScreen from "../screens/VerifyEmailScreen/VerifyEmail";
import ConfirmEmailChangeScreen from "../screens/ConfirmEmailChangeScreen/ConfirmEmailChange";
import { TabNavigator } from "@/components/organisms/TabNavigator/TabNavigator";

export type RootStackParamList = {
  Auth: undefined;
  Tabs: undefined;
  Profile: undefined;
  Accounts: undefined;
  Categories: undefined;
  Recurring: undefined;
  VerifyEmail: undefined;
  ConfirmEmailChange: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const colors = useColors();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <BackgroundGrid />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Tabs" : "Auth"}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Accounts" component={AccountsScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Recurring" component={RecurringScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="ConfirmEmailChange" component={ConfirmEmailChangeScreen} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
