import { Aclonica_400Regular, useFonts } from "@expo-google-fonts/aclonica";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import RootNavigator from "./src/navigation/RootNavigator";
import LogoSplashScreen from "./src/screens/LogoSplashScreen";
import OpeningScreen from "./src/screens/OpeningScreen";
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Boot sequence: native splash (fonts/assets loading) -> opening video ->
// 2s logo splash -> real app.
const STAGE = { VIDEO: "video", LOGO: "logo", APP: "app" };

export default function App() {
  const [fontsLoaded] = useFonts({
    Aclonica: Aclonica_400Regular,
  });
  const [stage, setStage] = React.useState(STAGE.VIDEO);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (stage === STAGE.VIDEO) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }} onLayout={onLayoutRootView}>
        <OpeningScreen onFinish={() => setStage(STAGE.LOGO)} />
      </View>
    );
  }

  if (stage === STAGE.LOGO) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }}>
        <LogoSplashScreen onFinish={() => setStage(STAGE.APP)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <NavigationContainer>
                <StatusBar style="dark" />
                <RootNavigator />
              </NavigationContainer>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </View>
  );
}
