import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Navigation } from "@/components/organisms/Navigation/Navigation";
import HomeScreen from "@/screens/HomeScreen/Home";
import ChartsScreen from "@/screens/ChartsScreen/Charts";
import UserScreen from "@/screens/UserScreen/User";

export type TabParamList = {
  Home: undefined;
  Charts: undefined;
  User: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabBar = (props: BottomTabBarProps) => <Navigation {...props} />;

export const TabNavigator = () => (
  <Tab.Navigator
    tabBar={tabBar}
    screenOptions={{
      headerShown: false,
      sceneContainerStyle: { backgroundColor: "transparent" },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Charts" component={ChartsScreen} />
    <Tab.Screen name="User" component={UserScreen} />
  </Tab.Navigator>
);
