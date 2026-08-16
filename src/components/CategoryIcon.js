import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/typography";

const ICONS = {
  burger: "hamburger",
  seafood: "fish",
  dessert: "cupcake",
  steak: "food-steak",
  pizza: "pizza",
};

export default function CategoryIcon({ category, active, onPress }) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.circle, active && styles.circleActive]}>
        <MaterialCommunityIcons
          name={ICONS[category.id] || "food"}
          size={24}
          color={active ? colors.white : colors.primary}
        />
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginRight: spacing.lg },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FDEDE8",
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: { backgroundColor: colors.primary },
  label: { marginTop: 6, fontSize: 12, color: colors.text, fontWeight: "600" },
  labelActive: { color: colors.primary },
});
