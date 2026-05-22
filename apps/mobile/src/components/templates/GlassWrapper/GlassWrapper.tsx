import { View } from "react-native";

interface GlassWrapperProps {
  children: React.ReactNode;
}

export const GlassWrapper = ({ children }: GlassWrapperProps) => {
  return <View>{children}</View>;
};
