import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { useAuth } from "../context/AuthContext";

const MENU = [
  { key: "orders", label: "Order History", icon: "receipt-outline", route: "OrdersHistory" },
  { key: "favorites", label: "Favorites", icon: "heart-outline", route: "Favorites" },
  { key: "address", label: "Delivery Addresses", icon: "location-outline" },
  { key: "payment", label: "Payment Methods", icon: "card-outline" },
  { key: "support", label: "Help & Support", icon: "help-circle-outline" },
];

export default function ProfileScreen({ navigation }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || "G").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ marginLeft: spacing.md }}>
          <Text style={styles.name}>{user?.name || "Guest"}</Text>
          <Text style={styles.email}>{user?.email || "Not signed in"}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {MENU.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={styles.menuRow}
            onPress={() => m.route && navigation.navigate(m.route)}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={m.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{m.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {isAuthenticated && (
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.white, fontSize: 22, fontWeight: "800" },
  name: { fontSize: 17, fontWeight: "800", color: colors.text },
  email: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  menu: { marginTop: spacing.sm, paddingHorizontal: spacing.lg },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDEDE8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.text },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: spacing.xl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  logoutText: { color: colors.primary, fontWeight: "700", marginLeft: spacing.sm },
});
