import React, { useCallback, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { fonts, radius, spacing } from "../theme/typography";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Logo from "../components/Logo";
import SocialButton from "../components/SocialButton";

export default function SignupScreen({ navigation }) {
  const { signup, continueAsGuest, socialLogin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "facebook" | null
  const [error, setError] = useState("");

  // Hardware back button on the Signup screen should return to the
  // onboarding carousel rather than exiting the app or falling through
  // to whatever the default stack behavior would be.
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Onboarding");
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const onSignup = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup({ name, email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSocialSignup = async (provider) => {
    setError("");
    setSocialLoading(provider);
    try {
      await socialLogin(provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Logo size={56} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Oripio and dive into pure flavor.</Text>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Jane Doe"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            style={styles.input}
          />

          <View style={{ height: spacing.lg }} />
          <Button title="Sign Up" onPress={onSignup} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialButton
              provider="google"
              onPress={() => onSocialSignup("google")}
              style={socialLoading === "google" && styles.socialDisabled}
            />
            <SocialButton
              provider="facebook"
              onPress={() => onSocialSignup("facebook")}
              style={socialLoading === "facebook" && styles.socialDisabled}
            />
          </View>

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={() => continueAsGuest().catch((e) => setError(e.message))}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, flexGrow: 1 },
  logoRow: { alignItems: "center", marginTop: spacing.lg },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.primary,
    backgroundColor: "#FDECE8",
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    color: colors.textMuted,
    fontSize: 12,
    marginHorizontal: spacing.sm,
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  socialDisabled: { opacity: 0.6 },
  guestBtn: { alignItems: "center", marginTop: spacing.lg },
  guestText: { color: colors.primary, fontWeight: "700" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  footerText: { color: colors.textMuted },
  footerLink: { color: colors.primary, fontWeight: "700" },
});
