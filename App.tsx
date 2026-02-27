import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useAppTheme } from './src/context/AppContext';
import { COLORS, FONT, SHADOW } from './src/theme/theme';

// Splash
import SplashScreen from './src/screens/SplashScreen';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

// Tab Screens
import HomeScreen from './src/screens/HomeScreen';
import FitnessScreen from './src/screens/Fitness';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Stack Screens
import UploadScreen from './src/screens/UploadScreen';
import ResultScreen from './src/screens/ResultScreen';
import ScriptAnalyzerScreen from './src/screens/ScriptAnalyzerScreen';
import AdviceCautionScreen from './src/screens/AdviceCautionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationPanelScreen from './src/screens/NotificationPanelScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Tab Icon ───────────────────────────────────────────────────────
interface TabIconProps { emoji: string; label: string; focused: boolean; }
function TabIcon({ emoji, label, focused }: TabIconProps) {
  const { colors } = useAppTheme()!;
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabIconWrap, focused && { backgroundColor: colors.primaryLight }]}>
        <Text style={styles.tabEmoji}>{emoji}</Text>
      </View>
      <Text
        style={[styles.tabLabel, focused && { color: colors.primary, fontWeight: '700' }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </View>
  );
}

// ── Bottom Tabs ────────────────────────────────────────────────────
function MainTabs() {
  const { colors, strings } = useAppTheme()!;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.surface }],
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="🏠" label={strings.home} focused={focused} /> }} />
      <Tab.Screen name="fitness" component={FitnessScreen} options={{ tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="🏃" label={strings.fitness} focused={focused} /> }} />
      {/* <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="📋" label={strings.history} focused={focused} /> }} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="👤" label={strings.profile} focused={focused} /> }} />
    </Tab.Navigator>
  );
}

// ── Inner App (has access to context) ─────────────────────────────
function InnerApp() {
  const [showSplash, setShowSplash] = useState(true);
  const { isDark, colors } = useAppTheme()!;

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.danger,
        },
      }}
    >
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        {/* Auth */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />

        {/* Main app with bottom tabs */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Home Screen */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        {/* Full-screen stack */}
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="ScriptAnalyzer" component={ScriptAnalyzerScreen} />
        <Stack.Screen name="AdviceCaution" component={AdviceCautionScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationPanelScreen} />

        {/* Profile Page */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ── Root App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <InnerApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 90, // increased height to accommodate labels
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...SHADOW.lg,
    paddingBottom: 20, // increased bottom padding
    paddingTop: 8, // added top padding
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabIconWrap: {
    width: 44, height: 30,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 12, marginBottom: 3,
  },
  tabEmoji: { fontSize: 22, textAlign: 'center' },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
});
