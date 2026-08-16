import client from "./client";

export async function signup({ name, email, password }) {
  const { data } = await client.post("/auth/signup", { name, email, password });
  return data; // { token, user }
}

export async function login({ email, password }) {
  const { data } = await client.post("/auth/login", { email, password });
  return data; // { token, user }
}

export async function continueAsGuest() {
  const { data } = await client.post("/auth/guest");
  return data; // { token, user }
}

export async function fetchMe() {
  const { data } = await client.get("/auth/me");
  return data.user;
}
