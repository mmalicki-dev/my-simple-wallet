import { View, Text } from "react-native";
import { useColors } from "@/hooks";
import { CHART_HEIGHT } from "@/screens/ChartsScreen/chartTypes";

const EmptyChart = ({ message }: { message: string }) => {
  const colors = useColors();
  return (
    <View
      style={{
        height: CHART_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.textMuted, fontSize: 13 }}>{message}</Text>
    </View>
  );
};

export default EmptyChart;
