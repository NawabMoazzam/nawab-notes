import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 1. Keep the splash screen visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Use `useFonts` only if you can't use the config plugin.
  const [loaded, error] = useFonts({
    ShadowsIntoLight: require("@/assets/fonts/ShadowsIntoLight-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            title: "Nawab Notes",
            headerStyle: { backgroundColor: "#1E293B" },
            headerTitleStyle: { fontWeight: "700", color: "#F8FAFC" },
            headerTintColor: "#F8FAFC",
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
