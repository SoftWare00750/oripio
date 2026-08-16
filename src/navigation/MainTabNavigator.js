import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { useCart } from "../context/CartContext";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import CartScreen from "../screens/CartScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// Order matches the reference navbar: Home, Cart, Search, Favorites, Profile.
const ICONS = {
  Home: "home",
  Cart: "cart",
  Search: "search",
  Favorites: "heart",
  Profile: "person",
};

function TabIcon({ route, focused, color }) {
  const { itemCount } = useCart();
  const name = focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`;

  return (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <View>
        <Ionicons name={name} size={20} color={color} />
        {route.name === "Cart" && itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount > 9 ? "9+" : itemCount}</Text>
          </View>
        )}
      </View>
      {focused && <Text style={styles.iconLabel}>{route.name}</Text>}
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon route={route} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Floating rounded pill navbar, inset from the screen edges — matching
// the reference design instead of a flush, full-width bar.
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    borderTopWidth: 0,
    paddingHorizontal: 6,
    elevation: 12,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  tabBarItem: { height: 64, justifyContent: "center" },
  iconPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  iconPillActive: {},
  iconLabel: { color: colors.primary, fontSize: 12, fontFamily: fonts.display },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.primary,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeText: { color: colors.white, fontSize: 8, fontWeight: "800" },
});
