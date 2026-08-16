import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { fetchMenu } from "../api/catalog";
import { useCart } from "../context/CartContext";
import ScreenHeader from "../components/ScreenHeader";
import FoodCard from "../components/FoodCard";

const SORTS = [
  { id: null, label: "Sort" },
  { id: "rating", label: "Top Rated" },
  { id: "price_asc", label: "Price: Low-High" },
  { id: "price_desc", label: "Price: High-Low" },
];

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMenu({ category: category.id, sort })
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category.id, sort]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title={category.name} />

      <View style={styles.filterRow}>
        {SORTS.map((s) => (
          <TouchableOpacity
            key={s.label}
            style={[styles.chip, sort === s.id && styles.chipActive]}
            onPress={() => setSort(s.id)}
          >
            <Text style={[styles.chipText, sort === s.id && styles.chipTextActive]}>
              {s.label}
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color={sort === s.id ? colors.white : colors.text}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListEmptyComponent={
            <Text style={styles.empty}>No items in this category yet.</Text>
          }
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
              onAdd={() => addItem(item.id, 1)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: 8,
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.text },
  chipTextActive: { color: colors.white },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
});
