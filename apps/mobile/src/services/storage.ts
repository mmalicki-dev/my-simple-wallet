import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export const StorageService = {
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string): void => storage.set(key, value),
  delete: (key: string): void => { storage.remove(key) },
  clear: (): void => storage.clearAll(),
};
