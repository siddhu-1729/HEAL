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
 function LoginScreen () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Invalid password', 'Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    // Placeholder: replace with real auth call
    setTimeout(() => {
      setLoading(false);
      // On success navigate; adjust route name to your app's stack
      if (navigation && navigation.navigate) navigation.navigate('Home');
      else Alert.alert('Logged in', 'Login simulated (no navigation configured).');
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Image
            // source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Heal</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9AA0A6"
            returnKeyType="next"
          />

          <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9AA0A6"
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={() => setSecure((s) => !s)}
              style={styles.showBtn}
              accessibilityLabel="Toggle password visibility"
            >
              <Text style={styles.showText}>{secure ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotRow} onPress={() => Alert.alert('Reset', 'Reset password flow')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primary} onPress={handleLogin} disabled={loading}>
            <Text style={styles.primaryText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Google', 'Google sign-in placeholder')}>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Apple', 'Apple sign-in placeholder')}>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('SignUp')}> 
              <Text style={styles.signupLink}> Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  scroll: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: 18 },
  logo: { width: 88, height: 88, marginBottom: 12, backgroundColor: 'transparent' },
  title: { fontSize: 28, fontWeight: '700', color: '#0F1724' },
  subtitle: { fontSize: 14, color: '#52606D', marginTop: 6 },
  form: { marginTop: 12 },
  label: { fontSize: 13, color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EDF3',
    color: '#0F1724',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  showBtn: { paddingHorizontal: 12, justifyContent: 'center' },
  showText: { color: '#2563EB', fontWeight: '600' },
  forgotRow: { alignItems: 'flex-end', marginTop: 8 },
  forgot: { color: '#2563EB', fontSize: 13 },
  primary: {
    marginTop: 18,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  divider: { flex: 1, height: 1, backgroundColor: '#E6EDF3' },
  dividerText: { marginHorizontal: 12, color: '#94A3B8', fontSize: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6EDF3',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialText: { color: '#0F1724', fontWeight: '600' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  signupText: { color: '#475569' },
  signupLink: { color: '#2563EB', fontWeight: '600' },
});


export default LoginScreen;