import AsyncStorage from "@react-native-async-storage/async-storage";

// Oripio ships with a fully self-contained, on-device "backend": all data
// lives in AsyncStorage and every api/*.js module simulates the network
// calls a real server would handle. This means the app works standalone,
// with no server to run or configure. Swap these modules out for real
// `fetch`/`axios` calls whenever a real backend is ready — every screen
// and context already talks to this layer through stable function
// signatures, so nothing above this layer needs to change.

export const TOKEN_KEY = "oripio_auth_token";
export const SESSION_KEY = "oripio_session"; // { token, user }
export const USERS_KEY = "oripio_users"; // { [email]: { ...user, password } }

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

export async function writeJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
