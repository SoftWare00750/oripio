import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { placeOrder } from "../api/orders";
import ScreenHeader from "../components/ScreenHeader";
import Button from "../components/Button";

const METHODS = [
  { id: "card", label: "Credit & Debit Cards", icon: "card-outline" },
  { id: "paypal", label: "PayPal", icon: "logo-paypal" },
  { id: "cash", label: "Cash on Delivery", icon: "cash-outline" },
];

export default function CheckoutScreen({ navigation }) {
  const { cart, refresh } = useCart();
  const [method, setMethod] = useState("card");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("Mirpur, Dhaka Bangladesh");
  const [agree, setAgree] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    agree &&
    address.trim().length > 0 &&
    (method !== "card" || (holderName && expiry && cvc));

  const onPlaceOrder = async () => {
    setError("");
    if (!canSubmit) {
      setError("Please fill in the required fields and accept the terms.");
      return;
    }
    setPlacing(true);
    try {
      const order = await placeOrder({ deliveryAddress: address, paymentMethod: method });
      await refresh();
      navigation.reset({
        index: 1,
        routes: [
          { name: "MainTabs" },
          { name: "OrderConfirmation", params: { orderId: order.id } },
        ],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Payment" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>Pay with</Text>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodRow, method === m.id && styles.methodRowActive]}
              onPress={() => setMethod(m.id)}
            >
              <Ionicons name={m.icon} size={20} color={colors.text} />
              <Text style={styles.methodLabel}>{m.label}</Text>
              <View style={[styles.radio, method === m.id && styles.radioActive]}>
                {method === m.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}

          {method === "card" && (
            <View style={styles.cardForm}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                value={holderName}
                onChangeText={setHolderName}
                placeholder="Name on card"
                style={styles.input}
              />
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={styles.label}>MM/YY</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholder="MM/YY"
                    style={styles.input}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>CVC</Text>
                  <TextInput
                    value={cvc}
                    onChangeText={setCvc}
                    placeholder="CVC"
                    style={styles.input}
                    keyboardType="number-pad"
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.agreeRow} onPress={() => setAgree((a) => !a)}>
            <View style={[styles.checkbox, agree && styles.checkboxActive]}>
              {agree && <Ionicons name="checkmark" size={12} color={colors.white} />}
            </View>
            <Text style={styles.agreeText}>
              I have read and accept the terms of use, rules and privacy policy
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.mapPlaceholder}>
            <Image
              source={{ uri: "https://picsum.photos/seed/checkout-map/600/240" }}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons
              name="location-sharp"
              size={28}
              color={colors.primary}
              style={styles.mapPin}
            />
          </View>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Delivery address"
            style={[styles.input, { marginTop: spacing.sm }]}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalSub}>See price details</Text>
            </View>
            <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
          </View>

          <Button
            title="Place Order"
            variant="dark"
            loading={placing}
            disabled={!canSubmit}
            onPress={onPlaceOrder}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  methodRowActive: { borderColor: colors.primary, backgroundColor: "#FDF2EF" },
  methodLabel: { flex: 1, marginLeft: spacing.sm, fontSize: 14, fontWeight: "600", color: colors.text },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.primary },
  cardForm: { marginTop: spacing.sm },
  label: { fontSize: 12, fontWeight: "700", color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    fontSize: 14,
    backgroundColor: colors.surface,
  },
  rowInputs: { flexDirection: "row" },
  agreeRow: { flexDirection: "row", alignItems: "flex-start", marginTop: spacing.sm, marginBottom: spacing.md },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  agreeText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  mapPlaceholder: {
    height: 140,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPin: { position: "absolute" },
  error: { color: colors.primary, fontSize: 12, marginTop: spacing.sm },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  totalLabel: { fontSize: 14, fontWeight: "700", color: colors.text },
  totalSub: { fontSize: 11, color: colors.textMuted },
  totalValue: { fontSize: 20, fontWeight: "800", color: colors.text },
});
