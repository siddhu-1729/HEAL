// ─────────────────────────────────────────────────────────────────
// AppContext — global dark mode + language state
// ─────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COLORS } from '../theme/theme';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dark color overrides
export const DARK_COLORS = {
    ...COLORS,
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#1E293B',
    border: '#334155',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',
    // Keep brand colors same
};

// Language string keys used across the app
export const STRINGS = {
    en: {
        hello: 'Hello',
        appName: 'HealVerse',
        home: 'Home',
        fitness: 'Fitness',
        history: 'History',
        profile: 'Profile',
        notifications: 'Notifications',
        settings: 'Settings',
        logout: 'Log Out',
        logoutConfirm: 'Are you sure you want to log out?',
        cancel: 'Cancel',
        save: 'Save',
        editProfile: 'Edit Profile',
        darkMode: 'Dark Mode',
        language: 'Language',
        uploadScan: 'Upload Scan',
        selectFile: 'Select File',
        analyzing: 'Analyzing...',
        highRisk: 'High Risk',
        moderateRisk: 'Moderate Risk',
        lowRisk: 'Low Risk',
        bmi: 'BMI',
        steps: 'Steps',
        calories: 'Calories',
        water: 'Water',
        sleep: 'Sleep',
        scanHistory: 'Scan History',
        todayStats: "Today's Stats",
        appointments: 'Appointments',
        medicines: 'Medicines',
        advice: 'Advice & Caution',
        noNotifs: 'All caught up!',
    },
    te: {
        hello: 'నమస్కారం',
        appName: 'హీల్‌వర్స్',
        home: 'హోమ్',
        fitness: 'ఫిట్‌నెస్',
        history: 'చరిత్ర',
        profile: 'ప్రొఫైల్',
        notifications: 'నోటిఫికేషన్లు',
        settings: 'సెట్టింగ్‌లు',
        logout: 'లాగ్ అవుట్',
        logoutConfirm: 'మీరు నిజంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?',
        cancel: 'రద్దు',
        save: 'సేవ్',
        editProfile: 'ప్రొఫైల్ సవరించు',
        darkMode: 'డార్క్ మోడ్',
        language: 'భాష',
        uploadScan: 'స్కాన్ అప్‌లోడ్',
        selectFile: 'ఫైల్ ఎంచుకోండి',
        analyzing: 'విశ్లేషిస్తోంది...',
        highRisk: 'అధిక ప్రమాదం',
        moderateRisk: 'మధ్యస్థ ప్రమాదం',
        lowRisk: 'తక్కువ ప్రమాదం',
        bmi: 'బీఎంఐ',
        steps: 'అడుగులు',
        calories: 'కేలరీలు',
        water: 'నీరు',
        sleep: 'నిద్ర',
        scanHistory: 'స్కాన్ చరిత్ర',
        todayStats: 'ఈ రోజు స్థితి',
        appointments: 'అపాయింట్‌మెంట్‌లు',
        medicines: 'మందులు',
        advice: 'సలహా & జాగ్రత్త',
        noNotifs: 'అన్నీ చదివారు!',
    },
    hi: {
        hello: 'नमस्ते',
        appName: 'हीलवर्स',
        home: 'होम',
        fitness: 'फिटनेस',
        history: 'इतिहास',
        profile: 'प्रोफ़ाइल',
        notifications: 'सूचनाएं',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट',
        logoutConfirm: 'क्या आप वाकई लॉग आउट करना चाहते हैं?',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        editProfile: 'प्रोफ़ाइल संपादित करें',
        darkMode: 'डार्क मोड',
        language: 'भाषा',
        uploadScan: 'स्कैन अपलोड करें',
        selectFile: 'फ़ाइल चुनें',
        analyzing: 'विश्लेषण हो रहा है...',
        highRisk: 'उच्च जोखिम',
        moderateRisk: 'मध्यम जोखिम',
        lowRisk: 'कम जोखिम',
        bmi: 'बीएमआई',
        steps: 'कदम',
        calories: 'कैलोरी',
        water: 'पानी',
        sleep: 'नींद',
        scanHistory: 'स्कैन इतिहास',
        todayStats: 'आज की रिपोर्ट',
        appointments: 'अपॉइंटमेंट',
        medicines: 'दवाइयां',
        advice: 'सलाह और सावधानी',
        noNotifs: 'सब पढ़ लिया!',
    },
    ta: {
        hello: 'வணக்கம்',
        appName: 'ஹீல்வர்ஸ்',
        home: 'முகப்பு',
        fitness: 'உடற்பயிற்சி',
        history: 'வரலாறு',
        profile: 'சுயவிவரம்',
        notifications: 'அறிவிப்புகள்',
        settings: 'அமைப்புகள்',
        logout: 'வெளியேறு',
        logoutConfirm: 'நீங்கள் வெளியேற விரும்புகிறீர்களா?',
        cancel: 'ரத்து',
        save: 'சேமி',
        editProfile: 'சுயவிவரம் திருத்து',
        darkMode: 'இருண்ட பயன்முறை',
        language: 'மொழி',
        uploadScan: 'ஸ்கேன் பதிவேற்று',
        selectFile: 'கோப்பு தேர்வு',
        analyzing: 'பகுப்பாய்வு...',
        highRisk: 'அதிக ஆபத்து',
        moderateRisk: 'மிதமான ஆபத்து',
        lowRisk: 'குறைந்த ஆபத்து',
        bmi: 'பிஎம்ஐ',
        steps: 'அடிகள்',
        calories: 'கலோரி',
        water: 'தண்ணீர்',
        sleep: 'தூக்கம்',
        scanHistory: 'ஸ்கேன் வரலாறு',
        todayStats: 'இன்றைய நிலவரம்',
        appointments: 'சந்திப்புகள்',
        medicines: 'மருந்துகள்',
        advice: 'ஆலோசனை & எச்சரிக்கை',
        noNotifs: 'எல்லாம் படித்தாயிற்று!',
    },
};

export const INITIAL_WORKOUTS = [
    { id: '1', name: 'Morning Run', duration: '30 min', calories: 320, icon: '🏃', done: false, colors: COLORS.gradPrimary, threshold: 30, elapsed: 0, isActive: false },
    { id: '2', name: 'Push-Up Circuit', duration: '20 min', calories: 180, icon: '💪', done: false, colors: COLORS.gradAccent, threshold: 20, elapsed: 0, isActive: false },
    { id: '3', name: 'Yoga & Stretch', duration: '25 min', calories: 120, icon: '🧘', done: false, colors: COLORS.gradPurple, threshold: 25, elapsed: 0, isActive: false },
    { id: '4', name: 'Cycling', duration: '45 min', calories: 450, icon: '🚴', done: false, colors: COLORS.gradBone, threshold: 45, elapsed: 0, isActive: false },
];

const DEFAULT_CTX = {
    isDark: false,
    toggleDark: () => { },
    language: 'en',
    changeLanguage: (_lang) => { },
    colors: COLORS,
    strings: STRINGS.en,
    workouts: INITIAL_WORKOUTS,
    setWorkouts: () => { },
    activeSessionIndex: null,
    setActiveSessionIndex: () => { },
    currentUserId: 'guest',
    setCurrentUserId: () => { },
    userActivityStore: {},
    recordUserActivity: () => { },
    getUserActivityPayload: () => ({ userId: 'guest', activities: [] }),
    sendUserActivityToEndpoint: async () => ({ ok: false, status: 0, data: null }),
    sendFitnessAnalyze: async () => ({ ok: false, status: 0, data: null }),
};

const FITNESS_ANALYZE_ENDPOINT = 'http://192.168.68.157:8000/fitness/analyze';

const AppContext = createContext(DEFAULT_CTX);

export function AppProvider({ children }) {
    const [isDark, setIsDark] = useState(false);
    const [language, setLanguage] = useState('en');

    // Global Fitness State
    const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
    const [activeSessionIndex, setActiveSessionIndex] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('guest');
    const [userActivityStore, setUserActivityStore] = useState({});

    const colors = isDark ? DARK_COLORS : COLORS;
    const strings = STRINGS[language] ?? STRINGS.en;

    const toggleDark = () => setIsDark(d => !d);
    const changeLanguage = (lang) => setLanguage(lang);

    useEffect(() => {
        const hydrateActivityState = async () => {
            try {
                const [savedUserId, savedActivityStore] = await Promise.all([
                    AsyncStorage.getItem('activeUserId'),
                    AsyncStorage.getItem('userActivityStore'),
                ]);

                if (savedUserId?.trim()) {
                    setCurrentUserId(savedUserId.trim().toLowerCase());
                }

                if (savedActivityStore) {
                    const parsed = JSON.parse(savedActivityStore);
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        setUserActivityStore(parsed);
                    }
                }
            } catch (_err) {
            }
        };

        hydrateActivityState();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('activeUserId', currentUserId).catch(() => { });
    }, [currentUserId]);

    useEffect(() => {
        AsyncStorage.setItem('userActivityStore', JSON.stringify(userActivityStore)).catch(() => { });
    }, [userActivityStore]);

    const normalizeActivityName = useCallback((name) => (name || 'unknown').toString().trim().toLowerCase(), []);

    const recordUserActivity = useCallback((activityName, minutes, userIdArg) => {
        const targetUserId = (userIdArg || currentUserId || 'guest').toString().trim().toLowerCase();
        const normalizedActivity = normalizeActivityName(activityName);
        const durationMins = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;

        if (!durationMins) return;

        setUserActivityStore(prev => {
            const existingUser = prev[targetUserId] || { totalsByActivity: {}, sessions: [] };
            const nextTotal = (existingUser.totalsByActivity[normalizedActivity] || 0) + durationMins;
            const nextSession = {
                activity: normalizedActivity,
                minutes: durationMins,
                recordedAt: new Date().toISOString(),
            };

            return {
                ...prev,
                [targetUserId]: {
                    totalsByActivity: {
                        ...existingUser.totalsByActivity,
                        [normalizedActivity]: nextTotal,
                    },
                    sessions: [...existingUser.sessions, nextSession],
                },
            };
        });
    }, [currentUserId, normalizeActivityName]);

    const getUserActivityPayload = useCallback((userIdArg) => {
        const targetUserId = (userIdArg || currentUserId || 'guest').toString().trim().toLowerCase();
        const userData = userActivityStore[targetUserId] || { totalsByActivity: {}, sessions: [] };

        return {
            userId: targetUserId,
            activities: Object.entries(userData.totalsByActivity).map(([activity, totalMinutes]) => ({
                activity,
                totalMinutes,
            })),
            sessions: userData.sessions,
            generatedAt: new Date().toISOString(),
        };
    }, [currentUserId, userActivityStore]);

    const sendUserActivityToEndpoint = useCallback(async (endpointUrl, userIdArg) => {
        const payload = getUserActivityPayload(userIdArg);
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        let data = null;
        try {
            data = await response.json();
        } catch (_err) {
        }

        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    }, [getUserActivityPayload]);

    const sendFitnessAnalyze = useCallback(async (userIdArg) => {
        return sendUserActivityToEndpoint(FITNESS_ANALYZE_ENDPOINT, userIdArg);
    }, [sendUserActivityToEndpoint]);

    useEffect(() => {
        const currentUserData = userActivityStore[currentUserId];
        if (!currentUserData || !Array.isArray(currentUserData.sessions) || currentUserData.sessions.length === 0) {
            return;
        }

        sendFitnessAnalyze(currentUserId).catch(() => { });
    }, [currentUserId, sendFitnessAnalyze, userActivityStore]);

    // Global Timer Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setWorkouts(prev => {
                let shouldAdvance = false;

                const nextWorkouts = prev.map((w, index) => {
                    const isCurrentlyActiveSession = activeSessionIndex === index;

                    if (isCurrentlyActiveSession && w.elapsed < w.threshold * 60) {
                        return { ...w, elapsed: w.elapsed + 1, isActive: true };
                    } else if (isCurrentlyActiveSession && w.elapsed === w.threshold * 60) {
                        if (!w.done) {
                            recordUserActivity(w.name, w.threshold);
                            shouldAdvance = true;
                            return { ...w, elapsed: w.elapsed, isActive: false, done: true };
                        }
                    }

                    // Strict singleton rule: If not the current session, it CANNOT be active.
                    if (!isCurrentlyActiveSession && w.isActive) {
                        return { ...w, isActive: false };
                    }

                    return w;
                });

                if (shouldAdvance && activeSessionIndex !== null) {
                    if (activeSessionIndex < nextWorkouts.length - 1) {
                        const nextIdx = activeSessionIndex + 1;
                        setActiveSessionIndex(nextIdx);
                        // Let the view handle scrolling based on index change
                    } else {
                        Alert.alert('Workout Complete!', 'You finished all activities!');
                        setActiveSessionIndex(null);
                    }
                }
                return nextWorkouts;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [activeSessionIndex, recordUserActivity]);

    return (
        <AppContext.Provider value={{
            isDark, toggleDark, language, changeLanguage, colors, strings,
            workouts, setWorkouts, activeSessionIndex, setActiveSessionIndex,
            currentUserId, setCurrentUserId,
            userActivityStore, recordUserActivity, getUserActivityPayload, sendUserActivityToEndpoint,
            sendFitnessAnalyze
        }}>
            {children}
        </AppContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useAppTheme() {
    return useContext(AppContext);
}

export function useFitness() {
    return useContext(AppContext);
}
