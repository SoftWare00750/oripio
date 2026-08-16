import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import GoogleIcon from "./icons/GoogleIcon";
import FacebookIcon from "./icons/FacebookIcon";

// Shared "Continue/Sign up with Google|Facebook" button used on both the
// Login and Signup screens. `provider` picks the icon + label; `onPress`
// is left to the caller so each screen can wire up its own auth flow.
export default function SocialButton({ provider, onPress, style }) {
  const isGoogle = provider === "google";
  const label = isGoogle ? "Google" : "Facebook";

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.base, style]}>
      {isGoogle ? <GoogleIcon size={20} /> : <FacebookIcon size={20} />}
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
});
