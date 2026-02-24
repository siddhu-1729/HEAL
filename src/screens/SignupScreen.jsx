import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Alert, Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const STEPS = ['Personal', 'Medical', 'Security'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['Male', 'Female', 'Other'];

// ─────────────────────────────────────────────────────────────────
// InputField is defined OUTSIDE SignupScreen to prevent re-mounting
// on every keystroke (which caused single-letter input bug)
// ─────────────────────────────────────────────────────────────────
const InputField = ({
  icon, label, value, onChange, placeholder,
  keyboard = 'default', secure = false, onSecureToggle,
  editable = true, onPress,
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity
      style={styles.inputRow}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <Text style={styles.inputPrefix}>{icon}</Text>
      <TextInput
        style={[styles.input, !editable && styles.inputReadOnly]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboard}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
      />
      {onSecureToggle && (
        <TouchableOpacity onPress={onSecureToggle} style={styles.eyeBtn}>
          <Text style={styles.eyeTxt}>{secure ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      )}
      {onPress && !onSecureToggle && (
        <Text style={styles.inputSuffix}>📅</Text>
      )}
    </TouchableOpacity>
  </View>
);

// Selector also outside to prevent remount
const Selector = ({ label, options, selected, onSelect }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chipRow}>
      {options.map(o => (
        <TouchableOpacity
          key={o}
          style={[styles.selectChip, selected === o && styles.selectChipActive]}
          onPress={() => onSelect(o)}
        >
          <Text style={[styles.selectChipTxt, selected === o && styles.selectChipTxtActive]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2
  const [dob, setDob] = useState(null);          // Date object
  const [showDatePkr, setShowDatePkr] = useState(false);
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [conditions, setConditions] = useState('');

  // Step 3
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [secureP, setSecureP] = useState(true);
  const [secureC, setSecureC] = useState(true);

  const dobDisplay = dob
    ? dob.toLocaleDateString('en-GB') // DD/MM/YYYY
    : '';

  const goTo = (next) => {
    Animated.timing(progress, {
      toValue: next / (STEPS.length - 1),
      duration: 300, useNativeDriver: false,
    }).start();
    setStep(next);
  };

  const validateStep = () => {
    if (step === 0) {
      if (!firstName.trim()) { Alert.alert('Required', 'First name is required.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { Alert.alert('Invalid', 'Enter a valid email.'); return false; }
    }
    if (step === 1) {
      if (!dob) { Alert.alert('Required', 'Please select your date of birth.'); return false; }
      if (!gender) { Alert.alert('Required', 'Please select your gender.'); return false; }
      if (!bloodGroup) { Alert.alert('Required', 'Please select blood group.'); return false; }
    }
    if (step === 2) {
      if (password.length < 6) { Alert.alert('Weak', 'Password must be 6+ characters.'); return false; }
      if (password !== confirm) { Alert.alert('Mismatch', 'Passwords do not match.'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) goTo(step + 1);
    else { Alert.alert('Success! 🎉', 'Account created!'); navigation.navigate('MainTabs'); }
  };

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Text style={styles.logoTxt}>H+</Text>
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Join HealVerse today</Text>
        </View>

        {/* Stepper */}
        <View style={styles.stepperWrap}>
          <View style={styles.stepperTrack}>
            <Animated.View style={[styles.stepperFill, { width: barWidth }]} />
          </View>
          <View style={styles.stepCircles}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.stepItem}>
                <LinearGradient
                  colors={i <= step ? COLORS.gradPrimary : [COLORS.border, COLORS.border]}
                  style={styles.stepCircle}
                >
                  <Text style={[styles.stepNum, { color: i <= step ? COLORS.textInverse : COLORS.textMuted }]}>
                    {i < step ? '✓' : i + 1}
                  </Text>
                </LinearGradient>
                <Text style={[styles.stepLabel, { color: i <= step ? COLORS.primary : COLORS.textMuted }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* ── Step 1 — Personal ── */}
          {step === 0 && (
            <>
              <Text style={styles.stepTitle}>Personal Information</Text>
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}>
                  <InputField icon="👤" label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
                </View>
                <View style={{ width: SPACING.md }} />
                <View style={{ flex: 1 }}>
                  <InputField icon="👤" label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
                </View>
              </View>
              <InputField
                icon="✉️" label="Email" value={email} onChange={setEmail}
                placeholder="you@email.com" keyboard="email-address"
              />
              <InputField
                icon="📞" label="Phone" value={phone} onChange={setPhone}
                placeholder="+91 9876543210" keyboard="phone-pad"
              />
            </>
          )}

          {/* ── Step 2 — Medical ── */}
          {step === 1 && (
            <>
              <Text style={styles.stepTitle}>Medical Information</Text>

              {/* DOB — calendar picker */}
              <InputField
                icon="🎂"
                label="Date of Birth"
                value={dobDisplay}
                onChange={() => { }}
                placeholder="Tap to select date"
                editable={false}
                onPress={() => setShowDatePkr(true)}
              />
              {showDatePkr && (
                <DateTimePicker
                  value={dob ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                  onChange={(event, selectedDate) => {
                    setShowDatePkr(false);
                    if (event.type !== 'dismissed' && selectedDate) setDob(selectedDate);
                  }}
                />
              )}

              <Selector label="Gender" options={GENDERS} selected={gender} onSelect={setGender} />
              <Selector label="Blood Group" options={BLOOD_GROUPS} selected={bloodGroup} onSelect={setBloodGroup} />
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}>
                  <InputField icon="⚖️" label="Weight (kg)" value={weight} onChange={setWeight} placeholder="70" keyboard="numeric" />
                </View>
                <View style={{ width: SPACING.md }} />
                <View style={{ flex: 1 }}>
                  <InputField icon="📏" label="Height (cm)" value={height} onChange={setHeight} placeholder="170" keyboard="numeric" />
                </View>
              </View>
              <InputField
                icon="🏥" label="Existing Conditions (optional)"
                value={conditions} onChange={setConditions}
                placeholder="e.g. Diabetes, Hypertension"
              />
            </>
          )}

          {/* ── Step 3 — Security ── */}
          {step === 2 && (
            <>
              <Text style={styles.stepTitle}>Create Password</Text>
              <InputField
                icon="🔒" label="Password" value={password} onChange={setPassword}
                placeholder="Min 6 characters" secure={secureP} onSecureToggle={() => setSecureP(p => !p)}
              />
              <InputField
                icon="🔐" label="Confirm Password" value={confirm} onChange={setConfirm}
                placeholder="Re-enter password" secure={secureC} onSecureToggle={() => setSecureC(p => !p)}
              />
              <View style={styles.termsRow}>
                <Text style={styles.termsTxt}>By signing up you agree to our </Text>
                <TouchableOpacity onPress={() => Alert.alert('Terms', 'Opening...')}>
                  <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Nav Buttons */}
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <LinearGradient colors={COLORS.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextGrad}>
              <Text style={styles.nextTxt}>
                {step < STEPS.length - 1 ? `Next: ${STEPS[step + 1]}  →` : '🎉  Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {step > 0 && (
            <TouchableOpacity style={styles.backBtnCard} onPress={() => goTo(step - 1)} activeOpacity={0.7}>
              <Text style={styles.backBtnTxt}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginTxt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>  Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.lg, paddingBottom: SPACING.xxxl },

  brand: { alignItems: 'center', marginBottom: SPACING.xxl, marginTop: SPACING.sm },
  logoBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md, ...SHADOW.lg },
  logoTxt: { fontSize: FONT.xxl, fontWeight: '800', color: COLORS.textInverse },
  appName: { fontSize: FONT.h1, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  tagline: { fontSize: FONT.sm, color: COLORS.textSecondary },

  stepperWrap: { marginBottom: SPACING.xl },
  stepperTrack: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginHorizontal: SPACING.xxxl, marginBottom: SPACING.md },
  stepperFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  stepCircles: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.md },
  stepItem: { alignItems: 'center', gap: 5 },
  stepCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  stepNum: { fontWeight: '700', fontSize: FONT.sm },
  stepLabel: { fontSize: FONT.xs, fontWeight: '600' },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xxl, ...SHADOW.md, marginBottom: SPACING.lg },
  stepTitle: { fontSize: FONT.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xl },

  rowFields: { flexDirection: 'row' },
  fieldWrap: { marginBottom: SPACING.lg },
  label: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md },
  inputReadOnly: { color: COLORS.textSecondary },
  inputPrefix: { fontSize: 16, marginRight: SPACING.sm },
  inputSuffix: { fontSize: 16, marginLeft: SPACING.sm },
  input: { flex: 1, paddingVertical: SPACING.md, fontSize: FONT.base, color: COLORS.textPrimary },
  eyeBtn: { paddingLeft: SPACING.sm },
  eyeTxt: { color: COLORS.primary, fontWeight: '600', fontSize: FONT.sm },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  selectChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surfaceAlt },
  selectChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectChipTxt: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
  selectChipTxtActive: { color: COLORS.textInverse },

  termsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: SPACING.lg },
  termsTxt: { fontSize: FONT.sm, color: COLORS.textMuted },
  termsLink: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '700' },

  nextBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  nextGrad: { paddingVertical: SPACING.lg, alignItems: 'center' },
  nextTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.md },
  backBtnCard: { alignItems: 'center', paddingVertical: SPACING.sm },
  backBtnTxt: { color: COLORS.textSecondary, fontWeight: '600', fontSize: FONT.base },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.sm },
  loginTxt: { color: COLORS.textSecondary, fontSize: FONT.sm },
  loginLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONT.sm },
});
