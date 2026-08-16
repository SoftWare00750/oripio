import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import StarRating from "./StarRating";

export default function FoodCard({ item, onPress, onAdd, style }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, style]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity style={styles.addBtn} onPress={onAdd} hitSlop={8}>
          <Ionicons name="add" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
      <View style={styles.metaRow}>
        <StarRating rating={item.rating} />
      </View>
      <View style={styles.metaRow}>
        <Text numberOfLines={1} style={styles.restaurant}>
          {item.restaurantName}
        </Text>
        <Text style={styles.price}>{item.price.toFixed(2)}$</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", marginBottom: spacing.lg },
  imageWrap: {
    borderRadius: radius.md,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  image: { width: "100%", height: "100%" },
  addBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { marginTop: spacing.sm, fontSize: 14, fontWeight: "700", color: colors.text },
  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  restaurant: { fontSize: 12, color: colors.textMuted, flexShrink: 1 },
  price: { fontSize: 13, fontWeight: "700", color: colors.text },
});
