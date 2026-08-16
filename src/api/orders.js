import { delay, readJSON, writeJSON, uid, SESSION_KEY } from "./client";
import { getCart, clearCart } from "./cart";
import { courier } from "../data/mockData";

const ORDERS_PREFIX = "oripio_orders_";

// Minutes-from-order-placed offsets for each tracking stage. Compressed
// so a real device sees visible progress within a few minutes.
const STAGE_OFFSETS = [
  { label: "Order Accepted", offsetMinutes: 0 },
  { label: "Checking Food", offsetMinutes: 2 },
  { label: "Foods On the way", offsetMinutes: 6 },
  { label: "Deliverd to you", offsetMinutes: 12 },
];

async function ordersKey() {
  const session = await readJSON(SESSION_KEY, null);
  if (!session?.user?.id) {
    throw new Error("Please log in to view your orders.");
  }
  return `${ORDERS_PREFIX}${session.user.id}`;
}

function withComputedView(order) {
  const now = Date.now();
  const timeline = STAGE_OFFSETS.map((stage) => {
    const time = order.createdAt + stage.offsetMinutes * 60000;
    return { label: stage.label, time: new Date(time).toISOString(), done: now >= time };
  });

  const deliveredAt = order.createdAt + STAGE_OFFSETS[STAGE_OFFSETS.length - 1].offsetMinutes * 60000;
  const minutesLeft = Math.max(0, Math.ceil((deliveredAt - now) / 60000));
  const estimatedMinutes = minutesLeft <= 0 ? "Delivered" : `${minutesLeft}-${minutesLeft + 5} min`;

  return { ...order, timeline, estimatedMinutes, courier };
}

export async function placeOrder({ deliveryAddress, paymentMethod }) {
  await delay(500);
  const cart = await getCart();
  if (!cart.items.length) {
    throw new Error("Your cart is empty.");
  }

  const order = {
    id: uid("order"),
    createdAt: Date.now(),
    items: cart.items.map((i) => ({
      menuItemId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      subtotal: Number((i.price * i.quantity).toFixed(2)),
    })),
    subtotal: cart.subtotal,
    deliveryFee: cart.deliveryFee,
    vat: cart.vat,
    total: cart.total,
    deliveryAddress,
    paymentMethod,
    status: "placed",
  };

  const key = await ordersKey();
  const existing = await readJSON(key, []);
  await writeJSON(key, [order, ...existing]);
  await clearCart();

  return withComputedView(order);
}

export async function fetchOrders() {
  await delay(250);
  const key = await ordersKey();
  const orders = await readJSON(key, []);
  return orders.map(withComputedView);
}

export async function fetchOrder(id) {
  await delay(200);
  const key = await ordersKey();
  const orders = await readJSON(key, []);
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found.");
  return withComputedView(order);
}
