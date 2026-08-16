import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function StarRating({ rating, size = 13, showValue = true }) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color={colors.star} />
      {showValue && <Text style={styles.value}>{Number(rating).toFixed(1)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  value: { marginLeft: 3, fontSize: 12, fontWeight: "700", color: "#1a1a1a" },
});
