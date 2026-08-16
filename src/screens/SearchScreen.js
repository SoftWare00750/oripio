import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { fetchMenu, fetchRestaurants } from "../api/catalog";
import { useCart } from "../context/CartContext";
import FoodCard from "../components/FoodCard";
import RestaurantCard from "../components/RestaurantCard";

export default function SearchScreen({ route, navigation }) {
  const { addItem } = useCart();
  const [query, setQuery] = useState(route.params?.initialQuery || "");
  const [menuResults, setMenuResults] = useState([]);
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (route.params?.initialQuery) {
      runSearch(route.params.initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = async (q) => {
    setSearched(true);
    setLoading(true);
    try {
      const [items, restaurants] = await Promise.all([
        fetchMenu({ search: q }),
        fetchRestaurants(q),
      ]);
      setMenuResults(items);
      setRestaurantResults(restaurants);
    } catch (err) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch(query)}
            placeholder="Search dishes or restaurants"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="search"
            autoFocus={!route.params?.initialQuery}
          />
        </View>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />}

      {!loading && searched && (
        <FlatList
          data={menuResults}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListHeaderComponent={
            restaurantResults.length > 0 ? (
              <View style={{ marginBottom: spacing.lg }}>
                <Text style={styles.sectionTitle}>Restaurants</Text>
                <FlatList
                  data={restaurantResults}
                  keyExtractor={(r) => r.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <RestaurantCard
                      restaurant={item}
                      onPress={() => navigation.navigate("Restaurant", { id: item.id })}
                    />
                  )}
                />
                <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Dishes</Text>
              </View>
            ) : (
              <Text style={styles.sectionTitle}>Dishes</Text>
            )
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No results for "{query}".</Text>
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

      {!searched && (
        <View style={styles.hint}>
          <Ionicons name="search-outline" size={40} color={colors.border} />
          <Text style={styles.hintText}>Search for your favorite dishes or restaurants</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.text },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
  hint: { alignItems: "center", marginTop: spacing.xxl },
  hintText: { color: colors.textMuted, marginTop: spacing.md, textAlign: "center", paddingHorizontal: spacing.xl },
});
