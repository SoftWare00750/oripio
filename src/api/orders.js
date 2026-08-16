import client from "./client";

export async function placeOrder({ deliveryAddress, paymentMethod }) {
  const { data } = await client.post("/orders", { deliveryAddress, paymentMethod });
  return data.order;
}

export async function fetchOrders() {
  const { data } = await client.get("/orders");
  return data.orders;
}

export async function fetchOrder(id) {
  const { data } = await client.get(`/orders/${id}`);
  return data.order;
}
