import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY, SESSION_KEY, USERS_KEY, delay, uid, readJSON, writeJSON } from "./client";

async function createSession(user) {
  const token = uid("tok");
  await writeJSON(SESSION_KEY, { token, user });
  return { token, user };
}

export async function signup({ name, email, password }) {
  await delay();
  if (!name || !email || !password) {
    throw new Error("Please fill in all fields.");
  }
  const users = await readJSON(USERS_KEY, {});
  const key = email.trim().toLowerCase();
  if (users[key]) {
    throw new Error("An account with this email already exists.");
  }
  const user = {
    id: uid("user"),
    name,
    email: key,
    address: "Mirpur, Dhaka Bangladesh",
  };
  users[key] = { ...user, password };
  await writeJSON(USERS_KEY, users);
  return createSession(user);
}

export async function login({ email, password }) {
  await delay();
  const users = await readJSON(USERS_KEY, {});
  const key = (email || "").trim().toLowerCase();
  const record = users[key];
  if (!record || record.password !== password) {
    throw new Error("Invalid email or password.");
  }
  const { password: _pw, ...user } = record;
  return createSession(user);
}

export async function socialLogin(provider) {
  await delay(200);
  const label = provider === "google" ? "Google" : "Facebook";
  const key = `${provider}-user@oripio.app`;
  const users = await readJSON(USERS_KEY, {});
  let record = users[key];
  if (!record) {
    record = {
      id: uid(provider),
      name: `${label} User`,
      email: key,
      address: "Mirpur, Dhaka Bangladesh",
      provider,
    };
    users[key] = record;
    await writeJSON(USERS_KEY, users);
  }
  const { password: _pw, ...user } = record;
  return createSession(user);
}

export async function continueAsGuest() {
  await delay(150);
  const user = {
    id: uid("guest"),
    name: "Guest",
    email: null,
    address: "Mirpur, Dhaka Bangladesh",
    isGuest: true,
  };
  return createSession(user);
}

export async function fetchMe() {
  await delay(150);
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const session = await readJSON(SESSION_KEY, null);
  if (!token || !session || session.token !== token) {
    throw new Error("Session expired. Please log in again.");
  }
  return session.user;
}
