import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { fetchOrders } from "../api/orders";
import { useCart } from "../context/CartContext";
import ScreenHeader from "../components/ScreenHeader";

const STATUS_LABEL = {
  placed: "Preparing",
};

export default function OrdersHistoryScreen({ navigation }) {
  const { addItem } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const reorder = async (order) => {
    for (const line of order.items) {
      await addItem(line.menuItemId, line.quantity);
    }
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="My Orders" />

      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: spacing.lg }}
          ListEmptyComponent={
            <Text style={styles.empty}>You haven't placed any orders yet.</Text>
          }
          renderItem={({ item: order }) => {
            const lastStage = order.timeline[order.timeline.length - 1];
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                    })}
                    {"  •  "}
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {lastStage.done ? "Delivered" : STATUS_LABEL[order.status] || "In Progress"}
                    </Text>
                  </View>
                </View>

                {order.items.map((line) => (
                  <View key={line.menuItemId} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {line.name} x{line.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>${line.subtotal.toFixed(2)}</Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total (VAT incl.)</Text>
                  <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => navigation.navigate("Tracking", { orderId: order.id })}
                  >
                    <Text style={styles.trackText}>Track</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reorderBtn} onPress={() => reorder(order)}>
                    <Text style={styles.reorderText}>Order Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  date: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  statusBadge: {
    backgroundColor: "#E6F5EC",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusText: { fontSize: 11, fontWeight: "700", color: colors.success },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  itemName: { flex: 1, fontSize: 13, color: colors.text, marginRight: spacing.sm },
  itemPrice: { fontSize: 13, color: colors.textMuted },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: 13, fontWeight: "700", color: colors.text },
  totalValue: { fontSize: 13, fontWeight: "800", color: colors.text },
  actionsRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.sm },
  trackBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    alignItems: "center",
    paddingVertical: 10,
  },
  trackText: { fontWeight: "700", color: colors.text, fontSize: 13 },
  reorderBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    paddingVertical: 10,
  },
  reorderText: { fontWeight: "700", color: colors.white, fontSize: 13 },
});
