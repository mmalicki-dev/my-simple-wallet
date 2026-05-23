import { SvgXml } from "react-native-svg";
import { iconData } from "@/generated/iconData";
import { useColors } from "@/hooks";
import type { IconName } from "shared";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon = ({ name, size = 24, color }: IconProps) => {
  const colors = useColors();
  const entry = iconData[name];
  if (!entry) return null;
  return (
    <SvgXml xml={entry.xml} width={size} height={size} color={color ?? colors.text} />
  );
};
