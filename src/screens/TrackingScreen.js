import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/typography";
import { fetchOrder } from "../api/orders";
import StylizedMap from "../components/StylizedMap";

export default function TrackingScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetchOrder(orderId)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.mapWrap}>
        <StylizedMap style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={styles.mapIconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.mapTitle}>Tracking</Text>
        <TouchableOpacity style={[styles.mapIconBtn, styles.mapIconRight]}>
          <Ionicons name="share-social-outline" size={18} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.etaCard}>
          <Text style={styles.etaLabel}>Estimated Time</Text>
          <Text style={styles.etaValue}>{order.estimatedMinutes}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.courierRow}>
          <Image source={{ uri: order.courier.photo }} style={styles.courierPhoto} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.courierLabel}>Being delivered by</Text>
            <Text style={styles.courierName}>{order.courier.name}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={colors.star} />
            <Text style={styles.ratingText}>{order.courier.rating}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <View style={styles.messageBox}>
            <Text style={styles.messagePlaceholder}>Send Message</Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL("tel:+10000000000")}
          >
            <Ionicons name="call" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.timeline}>
          {order.timeline.map((stage, i) => (
            <View key={stage.label} style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <View style={[styles.dot, stage.done && styles.dotDone]} />
                {i < order.timeline.length - 1 && (
                  <View style={[styles.line, stage.done && styles.lineDone]} />
                )}
              </View>
              <Text style={[styles.stageLabel, stage.done && styles.stageLabelDone]}>
                {stage.label}
              </Text>
              <Text style={styles.stageTime}>
                {new Date(stage.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  mapWrap: { height: 300, backgroundColor: colors.surface },
  mapIconBtn: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  mapIconRight: { left: undefined, right: spacing.lg },
  mapTitle: {
    position: "absolute",
    top: spacing.md + 6,
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  etaCard: {
    position: "absolute",
    top: 70,
    right: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    elevation: 2,
  },
  etaLabel: { fontSize: 11, color: colors.textMuted },
  etaValue: { fontSize: 16, fontWeight: "800", color: colors.text },
  panel: { flex: 1, padding: spacing.lg },
  courierRow: { flexDirection: "row", alignItems: "center" },
  courierPhoto: { width: 46, height: 46, borderRadius: 23 },
  courierLabel: { fontSize: 11, color: colors.textMuted },
  courierName: { fontSize: 15, fontWeight: "800", color: colors.text },
  ratingBadge: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 3, fontWeight: "700", color: colors.text },
  contactRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.sm },
  messageBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  messagePlaceholder: { color: colors.textMuted, fontSize: 13 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  timeline: { marginTop: spacing.xl },
  timelineRow: { flexDirection: "row", alignItems: "center", minHeight: 40 },
  timelineIconCol: { width: 24, alignItems: "center" },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white },
  dotDone: { borderColor: colors.success, backgroundColor: colors.success },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.success },
  stageLabel: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  stageLabelDone: { color: colors.text, fontWeight: "800" },
  stageTime: { fontSize: 12, color: colors.textMuted },
});
