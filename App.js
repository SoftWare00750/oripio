import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Aclonica_400Regular } from "@expo-google-fonts/aclonica";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import RootNavigator from "./src/navigation/RootNavigator";
import OpeningScreen from "./src/screens/OpeningScreen";
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    Aclonica: Aclonica_400Regular,
  });
  // The native splash (above) covers cold-start asset loading. Once fonts
  // are ready we swap it for the branded video opening/loading screen,
  // and only mount the real navigation tree once that video finishes.
  const [videoDone, setVideoDone] = React.useState(false);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!videoDone) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }} onLayout={onLayoutRootView}>
        <OpeningScreen onFinish={() => setVideoDone(true)} />
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
