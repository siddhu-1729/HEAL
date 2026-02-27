import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import scheduleDailyNotification from '../services/notification';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import Toast from 'react-native-toast-message';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password must be at least 6 characters long' });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: perform real login request here. Example (commented):
      // const res = await fetch(`${host}/login`, { method: 'POST', ... });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.detail || 'Login failed');
      // await AsyncStorage.setItem('jwtToken', data.access_token);

      // For now, navigate into the tab navigator so bottom bar shows
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      scheduleDailyNotification();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login Error', text2: err.message || 'Unable to login' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { user, idToken } = userInfo;
      const res = await fetch('YOUR_BACKEND_URL/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, email: user.email }),
      });
      if (res.ok) {
        Alert.alert('Success', `Logged in as ${user.email}`);
        navigation?.navigate('MainTabs');
      } else Alert.alert('Error', 'Backend authentication failed');
      // const res = await fetch('YOUR_BACKEND_URL/auth/google', {
      //   method: 'POST', headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ idToken, email: user.email }),
      // });
      // if (res.ok) { Alert.alert('Success', `Logged in as ${user.email}`); navigation?.navigate('MainTabs'); }
      // else Alert.alert('Error', 'Backend authentication failed');

      // Directly navigate to allow access
      navigation?.navigate('HomeScreen');
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;
      Alert.alert('Error', err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../heal_verse_logo.jpeg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>HealVerse</Text>
          <Text style={styles.tagline}>AI-Powered Health Intelligence</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to continue</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputPrefix}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputPrefix}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecure(s => !s)}
              style={styles.showBtn}
            >
              <Text style={styles.showTxt}>{secure ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() => Alert.alert('Reset', 'Password reset coming soon!')}
          >
            <Text style={styles.forgotTxt}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnLoading]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnTxt}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerTxt}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.socialBtnTxt}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupTxt}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.push('SignupScreen')}>
              <Text style={styles.signupLink}> Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  brand: { alignItems: 'center', marginBottom: SPACING.xxl },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.lg,
  },
  logoImage: { width: '100%', height: '100%' },
  logoTxt: { fontSize: FONT.xxl, fontWeight: '800', color: COLORS.textInverse },
  appName: {
    fontSize: FONT.h1,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  tagline: { fontSize: FONT.sm, color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOW.md,
  },
  cardTitle: {
    fontSize: FONT.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },

  label: {
    fontSize: FONT.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  inputPrefix: { fontSize: 16, marginRight: SPACING.sm },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT.base,
    color: COLORS.textPrimary,
  },
  showBtn: { paddingLeft: SPACING.sm },
  showTxt: { color: COLORS.primary, fontWeight: '600', fontSize: FONT.sm },

  forgotRow: { alignItems: 'flex-end', marginBottom: SPACING.xl },
  forgotTxt: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '600' },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOW.md,
  },
  btnLoading: { opacity: 0.75 },
  primaryBtnTxt: {
    color: COLORS.textInverse,
    fontWeight: '700',
    fontSize: FONT.md,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerTxt: {
    marginHorizontal: SPACING.md,
    fontSize: FONT.sm,
    color: COLORS.textMuted,
  },

  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },
  googleIcon: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: '#EA4335',
    marginRight: SPACING.sm,
  },
  socialBtnTxt: {
    fontSize: FONT.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  signupTxt: { color: COLORS.textSecondary, fontSize: FONT.sm },
  signupLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONT.sm },
});
