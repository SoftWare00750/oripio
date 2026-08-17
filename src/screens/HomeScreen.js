import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCategories, fetchRestaurants } from "../api/catalog";
import CategoryIcon from "../components/CategoryIcon";
import RestaurantCard from "../components/RestaurantCard";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";

const headerBg = require("../../assets/images/homescreen1.png");

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  // Home is the root screen of the app, so the back button doesn't have
  // anywhere further "back" to go — instead it offers to sign the user
  // out, matching the requested flow (confirm -> Sign In screen).
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Log Out", "Do you want to Log Out?", [
          { text: "Cancel", style: "cancel" },
          { text: "Log Out", style: "destructive", onPress: () => logout() },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [logout])
  );

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
        <ImageBackground
          source={headerBg}
          style={styles.headerCard}
          imageStyle={styles.headerCardImage}
          resizeMode="cover"
        >
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.roundIcon}>
              <Feather name="menu" size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.locationWrap}>
              <Text style={styles.locationLabel}>Delivery location</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={14} color={colors.primary} />
                <Text style={styles.locationText}>
                  {user?.address || "Ikeja, Lagos"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.roundIcon}>
              <Ionicons name="notifications-outline" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.discountRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.discountPercent}>30%</Text>
              <Text style={styles.discountLabel}>EXTRA DISCOUNT</Text>
              <Text style={styles.discountSub}>
                Enjoy your first order with a special discount!
              </Text>
            </View>
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
        </ImageBackground>

        {loading ? (
          <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesRow}
              contentContainerStyle={styles.categoriesRowContent}
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
  scroll: { paddingBottom: 110 },
  headerCard: {
    borderRadius: radius.lg,
    margin: spacing.lg,
    padding: spacing.lg,
    overflow: "hidden",
  },
  headerCardImage: {
    borderRadius: radius.lg,
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
  categoriesRowContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
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