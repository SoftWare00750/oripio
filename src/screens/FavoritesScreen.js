import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/typography";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import FoodCard from "../components/FoodCard";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { addItem } = useCart();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="heart-outline" size={44} color={colors.border} />
            <Text style={styles.emptyText}>
              Tap the heart on any dish to save it here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
            onAdd={() => addItem(item.id, 1)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, flexGrow: 1 },
  emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: spacing.xxl, width: "100%" },
  emptyText: {
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
});
