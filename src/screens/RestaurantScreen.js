import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { fetchRestaurant } from "../api/catalog";
import { useCart } from "../context/CartContext";
import FoodCard from "../components/FoodCard";
import Button from "../components/Button";

const TABS = ["Popular", "Burger", "Steak", "Pizza", "Appetizer"];

export default function RestaurantScreen({ route, navigation }) {
  const { id } = route.params;
  const { addItem } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Popular");
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchRestaurant(id)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const filteredMenu = useMemo(() => {
    if (!data) return [];
    if (activeTab === "Popular") return data.menu;
    return data.menu.filter((m) => m.category === activeTab.toLowerCase());
  }, [data, activeTab]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!data) return null;
  const { restaurant } = data;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={filteredMenu}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={<Text style={styles.empty}>No items in this section.</Text>}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
            onAdd={() => addItem(item.id, 1)}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.coverWrap}>
              <Image source={{ uri: restaurant.cover }} style={styles.cover} />
              <TouchableOpacity
                style={[styles.roundIcon, styles.coverBack]}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={20} color={colors.white} />
              </TouchableOpacity>
              <View style={styles.coverActions}>
                <TouchableOpacity style={styles.roundIcon}>
                  <Ionicons name="heart-outline" size={18} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roundIcon, { marginLeft: 8 }]}>
                  <Ionicons name="share-social-outline" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
              <Image source={{ uri: restaurant.logo }} style={styles.logo} />
            </View>

            <Text style={styles.name}>{restaurant.name}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{restaurant.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{restaurant.products}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={14} color={colors.star} />
                  <Text style={styles.statValue}> {restaurant.rating}</Text>
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Button
                title={following ? "Following" : "Follow"}
                variant={following ? "outlineDark" : "dark"}
                style={{ flex: 1 }}
                onPress={() => setFollowing((f) => !f)}
              />
              <View style={{ width: spacing.sm }} />
              <TouchableOpacity style={styles.chatBtn}>
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deliveryCard}>
              <View style={styles.deliveryIcon}>
                <Ionicons name="bicycle" size={16} color={colors.primary} />
              </View>
              <Text style={styles.deliveryText}>
                Delivery Time: {restaurant.deliveryTime}
              </Text>
              <Text style={styles.deliveryText}>
                Charge: {restaurant.charge}$ · Min. Order: {restaurant.minOrder}$
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsRow}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            >
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={styles.tabItem}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab}
                  </Text>
                  {activeTab === tab && <View style={styles.tabUnderline} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  coverWrap: { height: 170 },
  cover: { width: "100%", height: "100%" },
  roundIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverBack: { position: "absolute", top: spacing.md, left: spacing.lg },
  coverActions: { position: "absolute", top: spacing.md, right: spacing.lg, flexDirection: "row" },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.white,
    position: "absolute",
    bottom: -30,
    alignSelf: "center",
    backgroundColor: colors.primary,
  },
  name: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginTop: 40,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  statBlock: { alignItems: "center", paddingHorizontal: spacing.lg },
  statValue: { fontSize: 15, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: colors.border },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  chatBtn: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chatText: { fontWeight: "700", color: colors.text },
  deliveryCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  deliveryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FDEDE8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  deliveryText: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  tabsRow: { marginTop: spacing.lg },
  tabItem: { marginRight: spacing.lg, alignItems: "center", paddingBottom: spacing.sm },
  tabText: { fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  tabTextActive: { color: colors.text, fontWeight: "800" },
  tabUnderline: {
    height: 3,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 6,
  },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
});
