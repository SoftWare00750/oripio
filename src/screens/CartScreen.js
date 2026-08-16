import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ScreenHeader from "../components/ScreenHeader";
import Button from "../components/Button";

export default function CartScreen({ navigation }) {
  const { cart, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [promo, setPromo] = useState("");

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScreenHeader title="My Cart" />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Log in to start adding items to your cart.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="My Cart" />

      <FlatList
        data={cart.items}
        keyExtractor={(i) => i.menuItemId}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 320 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="cart-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <Button
              title="Browse Menu"
              style={{ marginTop: spacing.lg, paddingHorizontal: spacing.xl }}
              onPress={() => navigation.navigate("Home")}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  item.quantity > 1
                    ? updateItem(item.menuItemId, item.quantity - 1)
                    : removeItem(item.menuItemId)
                }
              >
                <Ionicons
                  name={item.quantity > 1 ? "remove" : "trash-outline"}
                  size={14}
                  color={colors.white}
                />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => updateItem(item.menuItemId, item.quantity + 1)}
              >
                <Ionicons name="add" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {cart.items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.promoRow}>
            <TextInput
              placeholder="Promo Code"
              value={promo}
              onChangeText={setPromo}
              style={styles.promoInput}
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Apply Code</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.billTitle}>Bill Details</Text>
          <BillRow label="Product Price" value={cart.subtotal} />
          <BillRow label="Delivery Charge" value={cart.deliveryFee} />
          <BillRow label="VAT" value={cart.vat} />
          <View style={styles.divider} />
          <BillRow label="Total Amount" value={cart.total} bold />

          <Button
            title="Proceed to Checkout"
            variant="dark"
            style={{ marginTop: spacing.lg }}
            onPress={() => navigation.navigate("Checkout")}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function BillRow({ label, value, bold }) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && styles.billLabelBold]}>{label}</Text>
      <Text style={[styles.billValue, bold && styles.billLabelBold]}>
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.md, fontSize: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  image: { width: 56, height: 56, borderRadius: radius.sm },
  name: { fontSize: 14, fontWeight: "700", color: colors.text },
  price: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.pill,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepBtn: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  stepValue: { width: 22, textAlign: "center", color: colors.white, fontWeight: "700", fontSize: 12 },
  footer: {
    position: "absolute",
    bottom: 96, // clears the floating pill navbar
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginHorizontal: spacing.sm,
  },
  promoRow: { flexDirection: "row", marginBottom: spacing.lg },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    fontSize: 13,
  },
  promoBtn: {
    backgroundColor: colors.black,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  promoBtnText: { color: colors.white, fontWeight: "700", fontSize: 12 },
  billTitle: { fontSize: 14, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  billLabel: { fontSize: 13, color: colors.textMuted },
  billValue: { fontSize: 13, color: colors.text, fontWeight: "600" },
  billLabelBold: { fontSize: 15, fontWeight: "800", color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});
