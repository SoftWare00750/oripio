import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { fonts, spacing } from "../theme/typography";
import Button from "../components/Button";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="gift" size={48} color={colors.primary} />
        </View>
        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully. Sit tight — great flavor is on the way!
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Track Order"
          variant="dark"
          onPress={() => navigation.replace("Tracking", { orderId })}
        />
        <View style={{ height: spacing.md }} />
        <Button
          title="Back to Home"
          variant="outlineDark"
          onPress={() => navigation.navigate("MainTabs")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white, justifyContent: "space-between" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FDEDE8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text, textAlign: "center" },
  subtitle: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  actions: { padding: spacing.lg },
});
