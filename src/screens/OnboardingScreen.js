import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef, useState } from "react";
import { BackHandler, Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../components/Button";
import { colors } from "../theme/colors";
import { fonts, spacing } from "../theme/typography";

const { width } = Dimensions.get("window");

// Slides 1 & 3 use the exact branded artwork supplied for onboarding —
// the headline text is already baked into the image, so no separate
// title overlay is rendered for them. Slide 2's supplied artwork wasn't
// included in the upload, so it falls back to a sourced photo with a
// text overlay matching the same style until the real asset is provided.
const SLIDES = [
  {
    key: "1",
    image: require("../../assets/images/onboarding/slide-pizza.png"),
    baked: true,
    ratio: 233 / 312,
  },
  {
    key: "2",
    image: require("../../assets/images/onboarding/slide-burger.png"),
    baked: true,
    ratio: 233 / 312,
  },
  {
    key: "3",
    image: require("../../assets/images/onboarding/slide-icecream.png"),
    baked: true,
    ratio: 233 / 312,
  },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const onMomentumEnd = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  // Hardware back button: step back one slide at a time. On the very
  // first slide there's nowhere further back to go, so it exits the app
  // (this is the root screen of the whole navigation stack).
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (index > 0) {
          const prevIndex = index - 1;
          listRef.current?.scrollToIndex({ index: prevIndex, animated: true });
          setIndex(prevIndex);
        } else {
          BackHandler.exitApp();
        }
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [index])
  );

  return (
    <LinearGradient colors={[colors.primary, colors.accentCoral]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(s) => s.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumEnd}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.progressRow}>
                {SLIDES.map((s, i) => (
                  <View
                    key={s.key}
                    style={[styles.progressDash, i === index && styles.progressDashActive]}
                  />
                ))}
              </View>

              {!item.baked && <Text style={styles.title}>{item.title}</Text>}

              <Image
                source={item.image}
                style={[
                  styles.image,
                  item.baked
                    ? { height: undefined, aspectRatio: item.ratio, borderRadius: 0 }
                    : null,
                ]}
                resizeMode={item.baked ? "contain" : "cover"}
              />

              <View style={styles.actions}>
                <Button title="Get Started" onPress={() => navigation.navigate("Signup")} />
                <View style={{ height: spacing.md }} />
                <Button
                  title="I already have an account"
                  variant="outline"
                  onPress={() => navigation.navigate("Login")}
                />
                <Text style={styles.terms}>
                  By continuing with Email, Google, or Social accounts, you confirm
                  that you accept our{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text> to enjoy safe food
                  delivery.
                </Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  slide: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: "flex-start" },
  progressRow: { flexDirection: "row", marginTop: spacing.sm, gap: 6 },
  progressDash: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  progressDashActive: { backgroundColor: colors.white },
  title: {
    fontFamily: fonts.display,
    color: colors.white,
    fontSize: 34,
    lineHeight: 40,
    marginTop: spacing.xl,
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 24,
    marginTop: spacing.xl,
  },
  actions: { marginTop: "auto", paddingBottom: spacing.md },
  terms: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 16,
  },
  termsLink: { color: colors.white, fontWeight: "700" },
});
