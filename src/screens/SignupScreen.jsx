import React, { useState, useRef } from 'react';
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
  Animated,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import Toast from 'react-native-toast-message';
const STEPS = ['Personal', 'Medical', 'Security'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['Male', 'Female', 'Other'];

const InputField = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  keyboard = 'default',
  secure = false,
  onSecureToggle,
  editable = true,
  onPress,
  required = false,
  error = '',
}) => (
  <View style={styles.fieldWrap}>
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.requiredStar}>*</Text>}
    </View>
    <TouchableOpacity
      style={[styles.inputRow, error && styles.inputRowError]}
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
      {onPress && !onSecureToggle && <Text style={styles.inputSuffix}>📅</Text>}
    </TouchableOpacity>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const Selector = ({
  label,
  options,
  selected,
  onSelect,
  required = false,
  error = '',
}) => (
  <View style={styles.fieldWrap}>
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.requiredStar}>*</Text>}
    </View>
    <View style={[styles.chipRow, error && styles.chipRowError]}>
      {options.map(o => (
        <TouchableOpacity
          key={o}
          style={[styles.selectChip, selected === o && styles.selectChipActive]}
          onPress={() => onSelect(o)}
        >
          <Text
            style={[
              styles.selectChipTxt,
              selected === o && styles.selectChipTxtActive,
            ]}
          >
            {o}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: null,

    gender: '',
    bloodGroup: '',
    // weight: '',
    // height: '',
    // conditions: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    password: '',
    confirm: '',
    secureP: true,
    secureC: true,
    loading: false,
    error: '',
    errors: {}, // Track field-specific errors
  });

  const dobDisplay = formData.dob
    ? formData.dob.toLocaleDateString('en-GB')
    : '';

  const goTo = next => {
    Animated.timing(progress, {
      toValue: next / (STEPS.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
    setStep(next);
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.firstName.trim())
        newErrors.firstName = 'First name is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
        newErrors.email = 'Enter a valid email';
      if (formData.phone.length < 10)
        newErrors.phone = 'Phone must be at least 10 digits';
    }
    if (step === 1) {
      if (!formData.dob) newErrors.dob = 'Please select your date of birth';
      if (!formData.gender) newErrors.gender = 'Please select your gender';
      if (!formData.bloodGroup)
        newErrors.bloodGroup = 'Please select blood group';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }
    if (step === 2) {
      if (!formData.emergencyContactName.trim())
        newErrors.emergencyContactName = 'Emergency contact name is required';
      if (formData.emergencyContactPhone.length < 10)
        newErrors.emergencyContactPhone = 'Phone must be at least 10 digits';
      if (formData.password.length < 6)
        newErrors.password = 'Password must be 6+ characters';
      if (formData.password !== formData.confirm)
        newErrors.confirm = 'Passwords do not match';
    }

    setFormData(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = dateObj => {
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const monthDiff = today.getMonth() - dateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateObj.getDate())
    )
      age--;
    return age;
  };

  const handleSignup = async () => {
    if (!validateStep()) return;

    setFormData(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const age = calculateAge(formData.dob);
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dob.toISOString().split('T')[0],
        age: age,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        password: formData.password,
      };

      console.log('Sending signup data:', signupData);

      const response = await fetch('http://192.168.68.157:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Signup failed');
      }

      console.log('Signup successful:', data);
      setFormData(prev => ({ ...prev, loading: false }));
      Toast.show({
        type: 'success',
        text1: 'Signup Successful',
        text2: 'Your account has been created. Please login.',
      })
      navigation.navigate('LoginScreen');
    } catch (err) {
      const errorMsg = err.message || 'An error occurred during signup';
      setFormData(prev => ({ ...prev, loading: false, error: errorMsg }));
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: errorMsg,
      });
      console.error('Signup error:', err);
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) goTo(step + 1);
    else handleSignup();
  };

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../heal_verse_logo.jpeg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Join HealVerse today</Text>
        </View>

        <View style={styles.stepperWrap}>
          <View style={styles.stepperTrack}>
            <Animated.View style={[styles.stepperFill, { width: barWidth }]} />
          </View>
          <View style={styles.stepCircles}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.stepItem}>
                <LinearGradient
                  colors={
                    i <= step
                      ? COLORS.gradPrimary
                      : [COLORS.border, COLORS.border]
                  }
                  style={styles.stepCircle}
                >
                  <Text
                    style={[
                      styles.stepNum,
                      {
                        color:
                          i <= step ? COLORS.textInverse : COLORS.textMuted,
                      },
                    ]}
                  >
                    {i < step ? '✓' : i + 1}
                  </Text>
                </LinearGradient>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: i <= step ? COLORS.primary : COLORS.textMuted },
                  ]}
                >
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          {step === 0 && (
            <>
              <Text style={styles.stepTitle}>Personal Information</Text>
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}>
                  <InputField
                    icon="👤"
                    label="First Name"
                    value={formData.firstName}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, firstName: e }))
                    }
                    placeholder="John"
                    required={true}
                    error={formData.errors.firstName}
                  />
                </View>
                <View style={{ width: SPACING.md }} />
                <View style={{ flex: 1 }}>
                  <InputField
                    icon="👤"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, lastName: e }))
                    }
                    placeholder="Doe"
                  />
                </View>
              </View>
              <InputField
                icon="✉️"
                label="Email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e }))}
                placeholder="you@email.com"
                keyboard="email-address"
                required={true}
                error={formData.errors.email}
              />
              <InputField
                icon="📞"
                label="Phone"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e }))}
                placeholder="+91 9876543210"
                keyboard="phone-pad"
                required={true}
                error={formData.errors.phone}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Text style={styles.stepTitle}>Medical Information</Text>
              <InputField
                icon="🎂"
                label="Date of Birth"
                value={dobDisplay}
                onChange={() => {}}
                placeholder="Tap to select date"
                editable={false}
                onPress={() =>
                  setFormData(prev => ({ ...prev, showDatePkr: true }))
                }
                required={true}
                error={formData.errors.dob}
              />
              {formData.showDatePkr && (
                <DateTimePicker
                  value={formData.dob ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                  onChange={(event, selectedDate) => {
                    setFormData(prev => ({ ...prev, showDatePkr: false }));
                    if (event.type !== 'dismissed' && selectedDate)
                      setFormData(prev => ({ ...prev, dob: selectedDate }));
                  }}
                />
              )}
              <Selector
                label="Gender"
                options={GENDERS}
                selected={formData.gender}
                onSelect={e => setFormData(prev => ({ ...prev, gender: e }))}
                required={true}
                error={formData.errors.gender}
              />
              <Selector
                label="Blood Group"
                options={BLOOD_GROUPS}
                selected={formData.bloodGroup}
                onSelect={e =>
                  setFormData(prev => ({ ...prev, bloodGroup: e }))
                }
                required={true}
                error={formData.errors.bloodGroup}
              />
              <View style={styles.rowFields}>
                {/* <View style={{ flex: 1 }}>
                  <InputField icon="⚖️" label="Weight (kg)" value={formData.weight} onChange={e => setFormData(prev => ({ ...prev, weight: e }))} placeholder="70" keyboard="numeric" />
                </View> */}
                <View style={{ width: SPACING.md }} />
                {/* <View style={{ flex: 1 }}>
                  <InputField icon="📏" label="Height (cm)" value={formData.height} onChange={e => setFormData(prev => ({ ...prev, height: e }))} placeholder="170" keyboard="numeric" />
                </View> */}
              </View>
              <InputField
                icon="🏥"
                label="Existing Conditions (optional)"
                value={formData.conditions}
                onChange={e =>
                  setFormData(prev => ({ ...prev, conditions: e }))
                }
                placeholder="e.g. Diabetes, Hypertension"
              />

              <Text style={[styles.stepTitle, { marginTop: SPACING.lg }]}>
                Address Information
              </Text>
              <InputField
                icon="🏠"
                label="Address"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e }))}
                placeholder="123 Main Street"
                required={true}
                error={formData.errors.address}
              />
              <InputField icon="🏥" label="Existing Conditions (optional)" value={formData.conditions} onChange={e => setFormData(prev => ({ ...prev, conditions: e }))} placeholder="e.g. Diabetes, Hypertension" />

              <Text style={[styles.stepTitle, { marginTop: SPACING.lg }]}>Address Information</Text>
              <InputField icon="🏠" label="Address" value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e }))} placeholder="123 Main Street" required={true} error={formData.errors.address} />
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}>
                  <InputField
                    icon="🏙️"
                    label="City"
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e }))}
                    placeholder="Enter your City"
                    required={true}
                    error={formData.errors.city}
                  />
                </View>
                <View style={{ width: SPACING.md }} />
                <View style={{ flex: 1 }}>
                  <InputField
                    icon="📍"
                    label="State"
                    value={formData.state}
                    onChange={e => setFormData(prev => ({ ...prev, state: e }))}
                    placeholder="State"
                    required={true}
                    error={formData.errors.state}
                  />
                </View>
              </View>
              <InputField
                icon="📮"
                label="ZIP Code"
                value={formData.zipCode}
                onChange={e => setFormData(prev => ({ ...prev, zipCode: e }))}
                placeholder="10001"
                keyboard="numeric"
                required={true}
                error={formData.errors.zipCode}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.stepTitle}>Emergency Contact</Text>
              <InputField
                icon="🚨"
                label="Emergency Contact Name"
                value={formData.emergencyContactName}
                onChange={e =>
                  setFormData(prev => ({ ...prev, emergencyContactName: e }))
                }
                placeholder="e.g. Family Member"
                required={true}
                error={formData.errors.emergencyContactName}
              />
              <InputField
                icon="📞"
                label="Emergency Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={e =>
                  setFormData(prev => ({ ...prev, emergencyContactPhone: e }))
                }
                placeholder="+91 9876543210"
                keyboard="phone-pad"
                required={true}
                error={formData.errors.emergencyContactPhone}
              />

              <Text style={[styles.stepTitle, { marginTop: SPACING.lg }]}>
                Create Password
              </Text>
              <InputField
                icon="🔒"
                label="Password"
                value={formData.password}
                onChange={e => setFormData(prev => ({ ...prev, password: e }))}
                placeholder="Min 6 characters"
                secure={formData.secureP}
                onSecureToggle={() =>
                  setFormData(prev => ({ ...prev, secureP: !prev.secureP }))
                }
                required={true}
                error={formData.errors.password}
              />
              <InputField
                icon="🔐"
                label="Confirm Password"
                value={formData.confirm}
                onChange={e => setFormData(prev => ({ ...prev, confirm: e }))}
                placeholder="Re-enter password"
                secure={formData.secureC}
                onSecureToggle={() =>
                  setFormData(prev => ({ ...prev, secureC: !prev.secureC }))
                }
                required={true}
                error={formData.errors.confirm}
              />
              <InputField icon="🚨" label="Emergency Contact Name" value={formData.emergencyContactName} onChange={e => setFormData(prev => ({ ...prev, emergencyContactName: e }))} placeholder="e.g. Family Member" required={true} error={formData.errors.emergencyContactName} />
              <InputField icon="📞" label="Emergency Contact Phone" value={formData.emergencyContactPhone} onChange={e => setFormData(prev => ({ ...prev, emergencyContactPhone: e }))} placeholder="+91 9876543210" keyboard="phone-pad" required={true} error={formData.errors.emergencyContactPhone} />

              <Text style={[styles.stepTitle, { marginTop: SPACING.lg }]}>Create Password</Text>
              <InputField icon="🔒" label="Password" value={formData.password} onChange={e => setFormData(prev => ({ ...prev, password: e }))} placeholder="Min 6 characters" secure={formData.secureP} onSecureToggle={() => setFormData(prev => ({ ...prev, secureP: !prev.secureP }))} required={true} error={formData.errors.password} />
              <InputField icon="🔐" label="Confirm Password" value={formData.confirm} onChange={e => setFormData(prev => ({ ...prev, confirm: e }))} placeholder="Re-enter password" secure={formData.secureC} onSecureToggle={() => setFormData(prev => ({ ...prev, secureC: !prev.secureC }))} required={true} error={formData.errors.confirm} />
              <View style={styles.termsRow}>
                <Text style={styles.termsTxt}>
                  By signing up you agree to our{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Terms', 'Opening...')}
                >
                  <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={COLORS.gradPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextGrad}
            >
              <Text style={styles.nextTxt}>
                {step < STEPS.length - 1
                  ? `Next: ${STEPS[step + 1]}  →`
                  : '  Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {step > 0 && (
            <TouchableOpacity
              style={styles.backBtnCard}
              onPress={() => goTo(step - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnTxt}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginTxt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.sm,
  },
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
  stepperWrap: { marginBottom: SPACING.xl },
  stepperTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginHorizontal: SPACING.xxxl,
    marginBottom: SPACING.md,
  },
  stepperFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepCircles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  stepItem: { alignItems: 'center', gap: 5 },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: { fontWeight: '700', fontSize: FONT.sm },
  stepLabel: { fontSize: FONT.xs, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOW.md,
    marginBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: FONT.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  rowFields: { flexDirection: 'row' },
  fieldWrap: { marginBottom: SPACING.lg },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
  requiredStar: {
    color: '#E74C3C',
    marginLeft: 4,
    fontSize: FONT.base,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputRowError: { borderColor: '#E74C3C' },
  inputReadOnly: { color: COLORS.textSecondary },
  inputPrefix: { fontSize: 16, marginRight: SPACING.sm },
  inputSuffix: { fontSize: 16, marginLeft: SPACING.sm },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT.base,
    color: COLORS.textPrimary,
  },
  eyeBtn: { paddingLeft: SPACING.sm },
  eyeTxt: { color: COLORS.primary, fontWeight: '600', fontSize: FONT.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chipRowError: { opacity: 0.7 },
  selectChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  selectChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectChipTxt: {
    fontSize: FONT.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  selectChipTxtActive: { color: COLORS.textInverse },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  termsTxt: { fontSize: FONT.sm, color: COLORS.textMuted },
  termsLink: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '700' },
  nextBtn: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  nextGrad: { paddingVertical: SPACING.lg, alignItems: 'center' },
  nextTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.md },
  backBtnCard: { alignItems: 'center', paddingVertical: SPACING.sm },
  backBtnTxt: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: FONT.base,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  loginTxt: { color: COLORS.textSecondary, fontSize: FONT.sm },
  loginLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONT.sm },
  errorText: {
    fontSize: FONT.xs,
    color: '#E74C3C',
    marginTop: 4,
    fontWeight: '500',
  },
});
