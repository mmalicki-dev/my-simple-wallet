import { View, TouchableOpacity, Text } from "react-native";

interface AuthTabsProps {
  currentTab: "login" | "register";
  onPress: (tab: "login" | "register") => void;
}

export const AuthTabs = ({ currentTab, onPress }: AuthTabsProps) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onPress("login")}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress("register")}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};
