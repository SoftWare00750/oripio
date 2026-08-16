import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { fetchMenu, fetchMenuItem } from "../api/catalog";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import Button from "../components/Button";

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    fetchMenuItem(id)
      .then(async (data) => {
        setItem(data);
        const more = await fetchMenu({ category: data.category });
        setRelated(more.filter((m) => m.id !== data.id).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const onAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(item.id, quantity);
      navigation.navigate("Cart");
    } catch (err) {
      // no-op: could surface a toast here
    } finally {
      setAdding(false);
    }
  };

  if (loading || !item) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.hero}>
            <Image source={{ uri: item.image }} style={styles.heroImage} />
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Details</Text>
            <TouchableOpacity style={styles.favorite} onPress={() => toggleFavorite(item)}>
              <Ionicons
                name={isFavorite(item.id) ? "heart" : "heart-outline"}
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color={colors.star} />
            <Text style={styles.rating}>
              {item.rating} ( {item.reviews}+ Reviews )
            </Text>
            <View style={styles.metaDeliveryDot} />
            <Ionicons name="time-outline" size={14} color={colors.success} />
            <Text style={styles.deliveryTime}>Delivery in {item.deliveryTime}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{String(quantity).padStart(2, "0")}</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setQuantity((q) => q + 1)}>
                <Ionicons name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredients}>{item.ingredients}</Text>

          {related.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Add More Food</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {related.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={styles.relatedCard}
                    onPress={() => navigation.push("ProductDetail", { id: r.id })}
                  >
                    <Image source={{ uri: r.image }} style={styles.relatedImage} />
                    <Text numberOfLines={1} style={styles.relatedName}>
                      {r.name}
                    </Text>
                    <Text style={styles.relatedPrice}>{r.price.toFixed(2)}$</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Add To Cart · $${(item.price * quantity).toFixed(2)}`}
          variant="dark"
          loading={adding}
          onPress={onAddToCart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.white },
  hero: { height: 340, backgroundColor: colors.primary },
  heroImage: { width: "100%", height: "100%" },
  back: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  favorite: {
    position: "absolute",
    top: spacing.md,
    right: spacing.lg,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    position: "absolute",
    top: spacing.md + 6,
    alignSelf: "center",
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  body: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  name: { fontSize: 22, fontWeight: "800", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8, flexWrap: "wrap" },
  rating: { marginLeft: 4, fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  metaDeliveryDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.border, marginHorizontal: 10 },
  deliveryTime: { marginLeft: 4, fontSize: 13, color: colors.success, fontWeight: "600" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  price: { fontSize: 24, fontWeight: "800", color: colors.text },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: { width: 30, textAlign: "center", fontWeight: "700", color: colors.text },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  ingredients: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  relatedCard: { width: 110, marginRight: spacing.md },
  relatedImage: { width: 110, height: 90, borderRadius: radius.md, backgroundColor: colors.surface },
  relatedName: { fontSize: 12, fontWeight: "700", color: colors.text, marginTop: 6 },
  relatedPrice: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
