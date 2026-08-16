import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { fetchCategories, fetchRestaurants } from "../api/catalog";
import { useAuth } from "../context/AuthContext";
import CategoryIcon from "../components/CategoryIcon";
import RestaurantCard from "../components/RestaurantCard";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [cats, rests] = await Promise.all([fetchCategories(), fetchRestaurants()]);
    setCategories(cats);
    setRestaurants(rests);
  }, []);

  useEffect(() => {
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const submitSearch = () => {
    navigation.navigate("Search", { initialQuery: search });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.roundIcon}>
              <Feather name="menu" size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.locationWrap}>
              <Text style={styles.locationLabel}>Delivery location</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={14} color={colors.primary} />
                <Text style={styles.locationText}>
                  {user?.address || "Mirpur, Dhaka Bangladesh"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.roundIcon}>
              <Ionicons name="notifications-outline" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.discountRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.discountPercent}>27%</Text>
              <Text style={styles.discountLabel}>EXTRA DISCOUNT</Text>
              <Text style={styles.discountSub}>
                Enjoy your first order with a special discount!
              </Text>
            </View>
            <Image
              source={{ uri: "https://picsum.photos/seed/home-discount/200/200" }}
              style={styles.discountImage}
            />
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={submitSearch}
                placeholder="Search"
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={submitSearch}>
              <Ionicons name="options-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesRow}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            >
              {categories.map((cat) => (
                <CategoryIcon
                  key={cat.id}
                  category={cat}
                  onPress={() => navigation.navigate("Category", { category: cat })}
                />
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Restaurant</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Search", {})}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            >
              {restaurants.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onPress={() => navigation.navigate("Restaurant", { id: r.id })}
                />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },
  headerCard: {
    backgroundColor: "#181818",
    borderRadius: radius.lg,
    margin: spacing.lg,
    padding: spacing.lg,
  },
  headerTop: { flexDirection: "row", alignItems: "center" },
  roundIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  locationWrap: { flex: 1, alignItems: "center" },
  locationLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  locationText: { color: colors.white, fontSize: 13, fontWeight: "700", marginLeft: 3 },
  discountRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.lg },
  discountPercent: { color: colors.primary, fontSize: 30, fontWeight: "800" },
  discountLabel: { color: colors.white, fontSize: 13, fontWeight: "800", marginTop: -4 },
  discountSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 6, maxWidth: 190 },
  discountImage: { width: 84, height: 84, borderRadius: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.lg, gap: 10 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.text },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesRow: { marginTop: spacing.sm },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: colors.text },
  seeAll: { color: colors.primary, fontWeight: "700", fontSize: 13 },
});
