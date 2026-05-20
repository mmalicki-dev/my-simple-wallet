import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

export const StorageService = {
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string): void => storage.set(key, value),
  delete: (key: string): void => storage.delete(key),
  clear: (): void => storage.clearAll(),
}
