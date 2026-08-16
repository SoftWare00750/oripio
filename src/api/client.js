import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Point this at your machine's LAN IP when testing on a physical device,
// e.g. "http://192.168.1.20:4000/api" — "localhost" only works in the
// iOS simulator / Android emulator with adb reverse.
const DEV_HOST = Platform.select({
  android: "http://10.0.2.2:4000/api", // Android emulator loopback to host machine
  default: "http://localhost:4000/api",
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_HOST;

export const TOKEN_KEY = "oripio_auth_token";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default client;
