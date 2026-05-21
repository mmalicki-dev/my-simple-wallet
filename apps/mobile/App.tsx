import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { LanguageProvider } from "./src/context/Language";
import { ThemeProvider } from "./src/context/Theme";
import RootNavigator from "./src/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks";
import { SecureTokenService } from "@/services/secureStorage";
import { setCredentials } from "@/redux/slices/authSlice";

function AppInitializer({ children }: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  async function init() {
    try {
      const { refreshToken, deviceID } = await SecureTokenService.getTokens();
      if (refreshToken && deviceID) {
        const BASE_URL =
          process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
        const res = await fetch(`${BASE_URL}/api/mobile/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken, deviceID }),
        });
        if (res.ok) {
          const json = await res.json();
          const d = json.data;
          dispatch(
            setCredentials({ user: d.user, accessToken: d.accessToken }),
          );
          await SecureTokenService.saveTokens(d.refreshToken, d.deviceID);
        } else {
          await SecureTokenService.clearTokens();
        }
      }
    } catch {
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    init();
  }, []);
  if (!ready) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <LanguageProvider>
          <ThemeProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </LanguageProvider>
      </AppInitializer>
    </Provider>
  );
}
