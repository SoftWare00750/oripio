import client from "./client";

export async function getCart() {
  const { data } = await client.get("/cart");
  return data; // { items, subtotal, deliveryFee, vat, total }
}

export async function addToCart(menuItemId, quantity = 1) {
  const { data } = await client.post("/cart", { menuItemId, quantity });
  return data;
}

export async function updateCartItem(menuItemId, quantity) {
  const { data } = await client.put(`/cart/${menuItemId}`, { quantity });
  return data;
}

export async function removeFromCart(menuItemId) {
  const { data } = await client.delete(`/cart/${menuItemId}`);
  return data;
}

export async function clearCart() {
  const { data } = await client.delete("/cart");
  return data;
}
