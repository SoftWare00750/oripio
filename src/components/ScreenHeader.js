import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/typography";

export default function ScreenHeader({ title, dark = false, right }) {
  const navigation = useNavigation();
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.iconBtn, dark && styles.iconBtnDark]}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={20} color={dark ? colors.white : colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, dark && styles.titleDark]} numberOfLines={1}>
        {title}
      </Text>
      {right || <View style={styles.iconBtn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnDark: { backgroundColor: "rgba(255,255,255,0.25)" },
  title: { fontSize: 17, fontWeight: "700", color: colors.text, flex: 1, textAlign: "center" },
  titleDark: { color: colors.white },
});
