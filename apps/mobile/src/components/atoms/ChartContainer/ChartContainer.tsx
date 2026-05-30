import { View } from "react-native";
import { CHART_HEIGHT } from "@/screens/ChartsScreen/chartTypes";

const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={{ height: CHART_HEIGHT }}>{children}</View>
);

export default ChartContainer;
