import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { fonts, spacing } from "../theme/typography";
import Button from "../components/Button";
import { IMAGES } from "../data/mockData";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    key: "1",
    title: "Dive Into\nPure Flavor",
    image: IMAGES.pizzaSupreme,
  },
  {
    key: "2",
    title: "Step Into\nFlavor World",
    image: IMAGES.bigCheeseburger,
  },
  {
    key: "3",
    title: "Flavor\nAwaits You",
    image: IMAGES.raspberryIceCream,
  },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const onMomentumEnd = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  return (
    <LinearGradient colors={["#241211", colors.primary]} style={styles.flex}>
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

              <Text style={styles.title}>{item.title}</Text>

              <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

              <View style={styles.actions}>
                <Button
                  title="Get Started"
                  onPress={() => navigation.navigate("Signup")}
                />
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
