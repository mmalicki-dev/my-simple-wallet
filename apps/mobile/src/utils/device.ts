import { Platform } from "react-native";

export const getDeviceInfo = () =>
  `MySimpleWallet/mobile (${Platform.OS} ${Platform.Version})`;
