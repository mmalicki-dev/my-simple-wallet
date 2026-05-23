import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BackgroundGrid } from "@/components/atoms/BackgroundGrid/BackgroundGrid";
import { useColors } from "@/hooks";
import AuthScreen from "../screens/AuthScreen/Auth";
import HomeScreen from "../screens/HomeScreen/Home";
import ChartsScreen from "../screens/ChartsScreen/Charts";
import UserScreen from "../screens/UserScreen/User";
import ProfileScreen from "../screens/ProfileScreen/Profile";
import AccountsScreen from "../screens/AccountsScreen/Accounts";
import CategoriesScreen from "../screens/CategoriesScreen/Categories";
import RecurringScreen from "../screens/RecurringScreen/Recurring";
import VerifyEmailScreen from "../screens/VerifyEmailScreen/VerifyEmail";
import ConfirmEmailChangeScreen from "../screens/ConfirmEmailChangeScreen/ConfirmEmailChange";

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Charts: undefined;
  User: undefined;
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

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <BackgroundGrid />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Charts" component={ChartsScreen} />
        <Stack.Screen name="User" component={UserScreen} />
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
  root: {
    flex: 1,
  },
});
