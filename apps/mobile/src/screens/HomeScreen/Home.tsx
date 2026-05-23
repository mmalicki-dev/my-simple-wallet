import { RootStackParamList } from "@/navigation";
import { useLogoutMutation } from "@/services";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<NavProp>();

  const [logout] = useLogoutMutation();
  const handleLogout = () => {
    logout();
    navigation.replace("Auth");
  };

  return (
    <ScreenLayout>
      <Text style={styles.title}>Home Screen</Text>
      <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default HomeScreen;
