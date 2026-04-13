import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

export const StorageService = {
  getToken: (): string | undefined => storage.getString('token'),
  setToken: (token: string): void => storage.set('token', token),
  removeToken: (): void => storage.delete('token'),
  clear: (): void => storage.clearAll(),
}
