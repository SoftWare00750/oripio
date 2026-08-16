import client from "./client";

export async function fetchRestaurants(search) {
  const { data } = await client.get("/restaurants", { params: { search } });
  return data.restaurants;
}

export async function fetchRestaurant(id) {
  const { data } = await client.get(`/restaurants/${id}`);
  return data; // { restaurant, menu }
}

export async function fetchCategories() {
  const { data } = await client.get("/menu/categories");
  return data.categories;
}

export async function fetchMenu({ category, sort, search } = {}) {
  const { data } = await client.get("/menu", { params: { category, sort, search } });
  return data.items;
}

export async function fetchMenuItem(id) {
  const { data } = await client.get(`/menu/${id}`);
  return data.item;
}
