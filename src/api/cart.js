import { delay, readJSON, writeJSON, SESSION_KEY } from "./client";
import { getMenuItemById } from "../data/mockData";

const CART_PREFIX = "oripio_cart_";
const DELIVERY_FEE = 2.5;
const VAT_RATE = 0.08;

async function cartKey() {
  const session = await readJSON(SESSION_KEY, null);
  if (!session?.user?.id) {
    throw new Error("Please log in to manage your cart.");
  }
  return `${CART_PREFIX}${session.user.id}`;
}

function computeTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = items.length ? DELIVERY_FEE : 0;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + deliveryFee + vat;
  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    vat: Number(vat.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export async function getCart() {
  await delay(200);
  const key = await cartKey();
  const items = await readJSON(key, []);
  return computeTotals(items);
}

export async function addToCart(menuItemId, quantity = 1) {
  await delay(200);
  const key = await cartKey();
  const items = await readJSON(key, []);
  const menuItem = getMenuItemById(menuItemId);
  if (!menuItem) throw new Error("Item not found.");

  const existing = items.find((i) => i.menuItemId === menuItemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      menuItemId,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity,
    });
  }
  await writeJSON(key, items);
  return computeTotals(items);
}

export async function updateCartItem(menuItemId, quantity) {
  await delay(200);
  const key = await cartKey();
  let items = await readJSON(key, []);
  if (quantity <= 0) {
    items = items.filter((i) => i.menuItemId !== menuItemId);
  } else {
    items = items.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i));
  }
  await writeJSON(key, items);
  return computeTotals(items);
}

export async function removeFromCart(menuItemId) {
  return updateCartItem(menuItemId, 0);
}

export async function clearCart() {
  await delay(150);
  const key = await cartKey();
  await writeJSON(key, []);
  return computeTotals([]);
}
