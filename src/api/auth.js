import AsyncStorage from "@react-native-async-storage/async-storage";
import { SESSION_KEY, TOKEN_KEY, USERS_KEY, delay, readJSON, uid, writeJSON } from "./client";

// Earlier builds shipped with this as the hardcoded default delivery
// address. Any account/session/guest created back then already has it
// saved to on-device storage, so just changing the default below won't
// fix it for people who already have data saved — we also need to patch
// any record we come across that still has the old value.
const OLD_DEFAULT_ADDRESS = "Mirpur, Dhaka Bangladesh";
const DEFAULT_ADDRESS = "Ikeja, Lagos";

function migrateAddress(user) {
  if (user && user.address === OLD_DEFAULT_ADDRESS) {
    return { ...user, address: DEFAULT_ADDRESS };
  }
  return user;
}

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
    address: DEFAULT_ADDRESS,
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
  const { password: _pw, ...rest } = record;
  const user = migrateAddress(rest);
  if (user.address !== rest.address) {
    users[key] = { ...record, address: user.address };
    await writeJSON(USERS_KEY, users);
  }
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
      address: DEFAULT_ADDRESS,
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
    address: DEFAULT_ADDRESS,
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
  const user = migrateAddress(session.user);
  if (user.address !== session.user.address) {
    await writeJSON(SESSION_KEY, { ...session, user });
    if (user.email) {
      const users = await readJSON(USERS_KEY, {});
      if (users[user.email]) {
        users[user.email] = { ...users[user.email], address: user.address };
        await writeJSON(USERS_KEY, users);
      }
    }
  }
  return user;
}