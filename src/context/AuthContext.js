import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../api/client";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  // Once someone has logged out mid-session, skip the onboarding carousel
  // and drop them straight on the Sign In screen next time.
  const [skipOnboarding, setSkipOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (savedToken) {
          setToken(savedToken);
          const me = await authApi.fetchMe();
          setUser(me);
        }
      } catch (err) {
        // stale/invalid token - clear it
        await AsyncStorage.removeItem(TOKEN_KEY);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const persistSession = useCallback(async (data) => {
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signup = useCallback(
    async (payload) => {
      const data = await authApi.signup(payload);
      await persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const login = useCallback(
    async (payload) => {
      const data = await authApi.login(payload);
      await persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const continueAsGuest = useCallback(async () => {
    const data = await authApi.continueAsGuest();
    await persistSession(data);
    return data.user;
  }, [persistSession]);

  const socialLogin = useCallback(
    async (provider) => {
      const data = await authApi.socialLogin(provider);
      await persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSkipOnboarding(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: !!token,
      skipOnboarding,
      signup,
      login,
      continueAsGuest,
      socialLogin,
      logout,
    }),
    [
      user,
      token,
      initializing,
      skipOnboarding,
      signup,
      login,
      continueAsGuest,
      socialLogin,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
