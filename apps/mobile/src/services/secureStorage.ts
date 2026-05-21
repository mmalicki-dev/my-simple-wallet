import * as SecureStore from "expo-secure-store";

interface IGetTokens {
  refreshToken: string | null;
  deviceID: string | null;
}

const REFRESH_TOKEN_KEY = "auth.refreshToken";
const DEVICE_ID_KEY = "auth.deviceID";

const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const SecureTokenService = {
  saveTokens: async (refreshToken: string, deviceID: string): Promise<void> => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, options);
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceID, options);
  },
  getTokens: async (): Promise<IGetTokens> => ({
    refreshToken: await SecureStore.getItemAsync(REFRESH_TOKEN_KEY, options),
    deviceID: await SecureStore.getItemAsync(DEVICE_ID_KEY, options),
  }),
  clearTokens: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, options);
    await SecureStore.deleteItemAsync(DEVICE_ID_KEY, options);
  },
};
