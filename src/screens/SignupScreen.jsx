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

<<<<<<< Updated upstream
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
=======
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSignup = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      // Prepare data for backend API
      const age = calculateAge(formData.dateOfBirth);
      const signupData = {
        // name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName:formData.lastName,
        email: formData.email,
        age: age,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender:formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
      };

      // Send data to FastAPI backend
      const response = await fetch('http://192.168.1.13:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const result = await response.json();
      console.log('Patient registered:', result);
      
      // Navigate to login screen on success
      setIsLoading(false);
      navigation.navigate('LoginScreen');
    } catch (error) {
      setIsLoading(false);
      console.error('Signup error:', error);
      // Show error message to user (you can add a toast notification here)
      setErrors({
        submit: error.message || 'An error occurred during signup. Please try again.',
      });
    }
  };

  const renderGenderOptions = () => {
    const genders = ['Male', 'Female', 'Other'];
    return (
      <View style={styles.optionsContainer}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.optionButton,
              selectedGender === gender && styles.optionButtonSelected,
            ]}
            onPress={() => {
              setSelectedGender(gender);
              updateFormData('gender', gender);
            }}
          >
            <Text
              style={[
                styles.optionText,
                selectedGender === gender && styles.optionTextSelected,
              ]}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderBloodGroupOptions = () => {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return (
      <View style={styles.bloodGroupContainer}>
        {bloodGroups.map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.bloodGroupButton,
              selectedBloodGroup === group && styles.bloodGroupButtonSelected,
            ]}
            onPress={() => {
              setSelectedBloodGroup(group);
              updateFormData('bloodGroup', group);
            }}
          >
            <Text
              style={[
                styles.bloodGroupText,
                selectedBloodGroup === group && styles.bloodGroupTextSelected,
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.progressDot,
              currentStep >= step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Let's get to know you better</Text>

      <View style={styles.rowContainer}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="John"
            placeholderTextColor="#9ca3af"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
        </View>

        <View style={styles.halfInput}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Doe"
            placeholderTextColor="#9ca3af"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="john.doe@email.com"
          placeholderTextColor="#9ca3af"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="1234567890"
          placeholderTextColor="#9ca3af"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Date of Birth *</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#9ca3af"
          value={formData.dateOfBirth}
          onChangeText={(text) => updateFormData('dateOfBirth', text)}
          keyboardType="numeric"
        />
        {errors.dateOfBirth && (
          <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Gender *</Text>
        {renderGenderOptions()}
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>Medical & Address Details</Text>
      <Text style={styles.stepSubtitle}>Help us serve you better</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Blood Group *</Text>
        {renderBloodGroupOptions()}
        {errors.bloodGroup && (
          <Text style={styles.errorText}>{errors.bloodGroup}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Street address"
          placeholderTextColor="#9ca3af"
          value={formData.address}
          onChangeText={(text) => updateFormData('address', text)}
          multiline
          numberOfLines={2}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#9ca3af"
            value={formData.city}
            onChangeText={(text) => updateFormData('city', text)}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <View style={styles.halfInput}>
          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#9ca3af"
            value={formData.state}
            onChangeText={(text) => updateFormData('state', text)}
          />
          {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>ZIP Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="123456"
          placeholderTextColor="#9ca3af"
          value={formData.zipCode}
          onChangeText={(text) => updateFormData('zipCode', text)}
          keyboardType="numeric"
          maxLength={6}
        />
        {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>Emergency Contact & Security</Text>
      <Text style={styles.stepSubtitle}>Almost there!</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Emergency Contact Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contact person name"
          placeholderTextColor="#9ca3af"
          value={formData.emergencyContactName}
          onChangeText={(text) => updateFormData('emergencyContactName', text)}
        />
        {errors.emergencyContactName && (
          <Text style={styles.errorText}>{errors.emergencyContactName}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Emergency Contact Phone *</Text>
        <TextInput
          style={styles.input}
          placeholder="1234567890"
          placeholderTextColor="#9ca3af"
          value={formData.emergencyContactPhone}
          onChangeText={(text) => updateFormData('emergencyContactPhone', text)}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {errors.emergencyContactPhone && (
          <Text style={styles.errorText}>{errors.emergencyContactPhone}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a strong password"
          placeholderTextColor="#9ca3af"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          placeholderTextColor="#9ca3af"
          value={formData.confirmPassword}
          onChangeText={(text) => updateFormData('confirmPassword', text)}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By signing up, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </Animated.View>
  );
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
        {/* Stepper */}
        <View style={styles.stepperWrap}>
          <View style={styles.stepperTrack}>
            <Animated.View style={[styles.stepperFill, { width: barWidth }]} />
=======
          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Error Message */}
          {errors.submit && (
            <View style={styles.submitErrorContainer}>
              <Text style={styles.submitErrorText}>{errors.submit}</Text>
            </View>
          )}

          {/* Form Steps */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentStep < 3 ? (
              <TouchableOpacity
                style={[styles.nextButton, currentStep === 1 && styles.fullWidthButton]}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={['#06b6d4', '#0891b2']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextButton, styles.fullWidthButton]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#06b6d4', '#0891b2']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.nextButtonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.lg, paddingBottom: SPACING.xxxl },
=======
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    top: -50,
    right: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    bottom: 100,
    left: -40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 4,
  },
  progressDotActive: {
    width: 32,
    backgroundColor: '#06b6d4',
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  input: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  textArea: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  optionButtonSelected: {
    backgroundColor: '#ecfeff',
    borderColor: '#06b6d4',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  optionTextSelected: {
    color: '#06b6d4',
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  bloodGroupButton: {
    width: '23%',
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '1%',
    marginBottom: 8,
  },
  bloodGroupButtonSelected: {
    backgroundColor: '#ecfeff',
    borderColor: '#06b6d4',
  },
  bloodGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  bloodGroupTextSelected: {
    color: '#06b6d4',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  backButton: {
    flex: 1,
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  nextButton: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  fullWidthButton: {
    flex: 1,
    marginRight: 0,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  termsContainer: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  termsLink: {
    color: '#06b6d4',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  loginLink: {
    fontSize: 14,
    color: '#06b6d4',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  submitErrorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  submitErrorText: {
    fontSize: 14,
    color: '#991b1b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
>>>>>>> Stashed changes

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
