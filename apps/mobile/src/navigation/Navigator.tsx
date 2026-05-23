import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen/Home";
import AuthScreen from "../screens/AuthScreen/Auth";
import { BackgroundGrid } from "@/components/atoms/BackgroundGrid/BackgroundGrid";
import { useColors } from "@/hooks";

export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const colors = useColors();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <BackgroundGrid />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
