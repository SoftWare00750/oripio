import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";

export default function Button({
  title,
  onPress,
  variant = "primary", // "primary" | "outline" | "outlineDark" | "dark"
  loading = false,
  disabled = false,
  style,
}) {
  const isOutline = variant === "outline"; // white border/text, for use on colored/dark backgrounds
  const isOutlineDark = variant === "outlineDark"; // dark border/text, for use on white backgrounds
  const isDark = variant === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isOutline && styles.outline,
        isOutlineDark && styles.outlineDark,
        isDark && styles.dark,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.white : colors.text} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline && styles.textOutline,
            isDark && styles.textDark,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  outlineDark: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dark: {
    backgroundColor: colors.black,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  textOutline: {
    color: colors.white,
  },
  textDark: {
    color: colors.white,
  },
});
