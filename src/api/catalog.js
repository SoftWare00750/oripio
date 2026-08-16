import { delay } from "./client";
import {
  categories as CATEGORIES,
  restaurants as RESTAURANTS,
  menuItems as MENU_ITEMS,
  getMenuItemById,
  getRestaurantById,
} from "../data/mockData";

function matchesSearch(text, query) {
  if (!query) return true;
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

export async function fetchRestaurants(search) {
  await delay(250);
  return RESTAURANTS.filter((r) => matchesSearch(r.name, search));
}

export async function fetchRestaurant(id) {
  await delay(250);
  const restaurant = getRestaurantById(id);
  if (!restaurant) throw new Error("Restaurant not found.");
  const menu = MENU_ITEMS.filter((m) => m.restaurantId === id);
  return { restaurant, menu };
}

export async function fetchCategories() {
  await delay(150);
  return CATEGORIES;
}

export async function fetchMenu({ category, sort, search } = {}) {
  await delay(250);
  let items = [...MENU_ITEMS];

  if (category) {
    items = items.filter((m) => m.category === category);
  }
  if (search) {
    items = items.filter(
      (m) => matchesSearch(m.name, search) || matchesSearch(m.restaurantName, search)
    );
  }

  if (sort === "rating") {
    items.sort((a, b) => b.rating - a.rating);
  } else if (sort === "price_asc") {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    items.sort((a, b) => b.price - a.price);
  }

  return items;
}

export async function fetchMenuItem(id) {
  await delay(200);
  const item = getMenuItemById(id);
  if (!item) throw new Error("Item not found.");
  return item;
}
