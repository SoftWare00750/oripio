import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";

export default function RestaurantCard({ restaurant, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <Image source={{ uri: restaurant.cover }} style={styles.image} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>50% Off</Text>
      </View>
      <TouchableOpacity style={styles.heart} hitSlop={8}>
        <Ionicons name="heart-outline" size={18} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text numberOfLines={1} style={styles.name}>
          {restaurant.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={12} color={colors.star} />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{restaurant.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginRight: spacing.md,
  },
  image: { width: "100%", height: 120 },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { padding: spacing.sm },
  name: { fontSize: 14, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rating: { fontSize: 12, fontWeight: "700", marginLeft: 3, color: colors.text },
  dot: { marginHorizontal: 5, color: colors.textMuted },
  time: { fontSize: 12, color: colors.textMuted },
});
