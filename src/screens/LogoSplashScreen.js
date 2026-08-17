import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

const logo = require("../../assets/oripio1.png");

// Shown for a fixed 2 seconds right after the opening video, before the
// real app (onboarding/navigation) mounts. Just the brand mark centered
// on the brand-red background, like a classic native splash screen.
const DISPLAY_MS = 2000;

export default function LogoSplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 160,
    height: 160,
  },
});
