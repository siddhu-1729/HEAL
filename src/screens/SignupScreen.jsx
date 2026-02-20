import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SignupScreen = ({navigation}) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!selectedGender) {
      newErrors.gender = 'Please select gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!selectedBloodGroup) {
      newErrors.bloodGroup = 'Please select blood group';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^\d{10}$/.test(formData.emergencyContactPhone.replace(/\D/g, ''))) {
      newErrors.emergencyContactPhone = 'Phone number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
  };

  const handleSignup = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);

    // Prepare final data
    const patientData = {
      ...formData,
      gender: selectedGender,
      bloodGroup: selectedBloodGroup,
    };

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Patient registered:', patientData);
      // Navigate to success screen or login
    }, 2000);
    navigation.navigate('LoginScreen');
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f9ff" />
      
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe', '#ffffff']}
        style={styles.gradient}
      />

      {/* Decorative elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#06b6d4', '#0891b2']}
                style={styles.logoGradient}
              >
                <Text style={styles.logoText}>H+</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our healthcare community</Text>
          </View>

          {/* Progress Bar */}
          {renderProgressBar()}

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
          </View>

          {/* Login Link */}
          {/* <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => console.log('Navigate to login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SignupScreen;
