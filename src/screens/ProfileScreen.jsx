import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { useAppTheme } from '../context/AppContext';

const INITIAL_DATA = {
    firstName: '',
    lastName: '',
    email: 'user@healverse.com',
    phone: '+91 98765 43210',
    age: null,
    bloodGroup: 'O+',
    gender: 'Male',
    city: 'Mumbai',
    address: '123, Health Street, Andheri West',
    emergencyContactName: 'Emergency Contact',
    emergencyContactPhone: '+91 91234 56789',
};

export default function ProfileScreen({ navigation }) {
    const { strings, language } = useAppTheme();
    const [profileData, setProfileData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://192.168.68.157:8000/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError(strings.sessionExpired || 'Session expired. Please login again');
                    await AsyncStorage.removeItem('jwtToken');
                } else {
                    setError(strings.fetchError || 'Failed to fetch profile data');
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            setProfileData(data);
            AsyncStorage.setItem('userName', data.firstName);
        } catch (err) {
            console.error('Profile fetch error:', err);
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('jwtToken');
            setShowLogoutModal(false);
            navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const HEALTH_BADGES = [
        { label: strings.bloodGroupLabel, value: profileData.bloodGroup, icon: '🩸', colors: COLORS.gradPink },
        { label: strings.genderLabel, value: profileData.gender, icon: '👤', colors: COLORS.gradPrimary },
        { label: strings.ageLabel, value: profileData.age ? `${profileData.age} ${strings.yrs}` : strings.na, icon: '🎂', colors: COLORS.gradAccent },
    ];

    const INFO_ITEMS = [
        { icon: '📞', label: strings.phoneLabel, value: profileData.phone },
        { icon: '📍', label: strings.locationLabel, value: `${profileData.city}` },
        { icon: '🏠', label: strings.addressLabel, value: profileData.address },
        { icon: '🚨', label: strings.emergencyContact, value: `${profileData.emergencyContactName} · ${profileData.emergencyContactPhone}` },
    ];

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>{strings.loadingProfile}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorTitle}>{strings.errorTitle}</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchProfileData}>
                        <Text style={styles.retryBtnText}>{strings.retry}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* ── Hero Header ── */}
                <LinearGradient colors={COLORS.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>

                    <View style={styles.avatarRing}>
                        <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={styles.avatarInner}>
                            <Text style={styles.avatarText}>{profileData.firstName[0]}</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.heroName}>{profileData.firstName} {profileData.lastName}</Text>
                    <Text style={styles.heroEmail}>{profileData.email}</Text>
                    {/* <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Settings')}>
                        <Text style={styles.editBtnText}>✏️  Edit Profile</Text>
                    </TouchableOpacity> */}
                </LinearGradient>

                {/* ── Health Badges ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{strings.healthSummary}</Text>
                    <View style={styles.badgeRow}>
                        {HEALTH_BADGES.map(b => (
                            <LinearGradient key={b.label} colors={b.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
                                <Text style={styles.badgeIcon}>{b.icon}</Text>
                                <Text style={styles.badgeVal}>{b.value}</Text>
                                <Text style={styles.badgeLabel}>{b.label}</Text>
                            </LinearGradient>
                        ))}
                    </View>
                </View>

                {/* ── Personal Info ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{strings.personalInfo}</Text>
                    <View style={styles.card}>
                        {INFO_ITEMS.map((item, i) => (
                            <View key={item.label} style={[styles.row, i < INFO_ITEMS.length - 1 && styles.rowBorder]}>
                                <View style={styles.rowIconWrap}>
                                    <Text style={styles.rowIcon}>{item.icon}</Text>
                                </View>
                                <View style={styles.rowContent}>
                                    <Text style={styles.rowLabel}>{item.label}</Text>
                                    <Text style={styles.rowValue}>{item.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Account ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{strings.accountTitle}</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => navigation.navigate('Settings')}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>⚙️</Text></View>
                            <Text style={[styles.rowValue, { flex: 1 }]}>{strings.settings}</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => { }}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🔒</Text></View>
                            <Text style={[styles.rowValue, { flex: 1 }]}>{strings.privacyPolicy}</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => { }}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>💬</Text></View>
                            <Text style={[styles.rowValue, { flex: 1 }]}>{strings.helpSupport}</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => { }}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>ℹ️</Text></View>
                            <Text style={[styles.rowValue, { flex: 1 }]}>{strings.aboutApp}</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.row} onPress={() => setShowLogoutModal(true)}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🚪</Text></View>
                            <Text style={[styles.rowValue, { flex: 1, color: COLORS.danger }]}>{strings.logout}</Text>
                            <Text style={[styles.chevron, { color: COLORS.danger }]}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* ── Logout Modal ── */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{strings.logout}</Text>
                        <Text style={styles.modalMessage}>{strings.logoutConfirm}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.cancelBtnText}>{strings.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.logoutBtn]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutBtnText}>{strings.yesLogout}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
    sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
    loadingText: { fontSize: FONT.base, color: COLORS.textMuted },

    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg, gap: SPACING.md },
    errorIcon: { fontSize: 48 },
    errorTitle: { fontSize: FONT.xl, fontWeight: '700', color: COLORS.textPrimary },
    errorMessage: { fontSize: FONT.base, color: COLORS.textMuted, textAlign: 'center' },
    retryBtn: { marginTop: SPACING.lg, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: RADIUS.full },
    retryBtnText: { color: COLORS.textInverse, fontWeight: '600', fontSize: FONT.base },

    // Hero
    hero: { paddingTop: SPACING.xl, paddingBottom: SPACING.xxxl, alignItems: 'center', paddingHorizontal: SPACING.lg },
    backBtn: { position: 'absolute', top: SPACING.lg, left: SPACING.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 28, color: COLORS.textInverse, lineHeight: 32 },
    avatarRing: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', overflow: 'hidden', marginTop: 8, marginBottom: SPACING.md, ...SHADOW.lg },
    avatarInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: FONT.h0, fontWeight: '700', color: COLORS.textInverse },
    heroName: { fontSize: FONT.xxl, fontWeight: '700', color: COLORS.textInverse, marginBottom: 4 },
    heroEmail: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.lg },
    editBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: RADIUS.full },
    editBtnText: { color: COLORS.textInverse, fontWeight: '600', fontSize: FONT.sm },

    // Badges
    badgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    badge: { flex: 1, marginHorizontal: 4, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, alignItems: 'center', ...SHADOW.md },
    badgeIcon: { fontSize: 22, marginBottom: 6 },
    badgeVal: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textInverse, marginBottom: 2 },
    badgeLabel: { fontSize: FONT.xs, color: 'rgba(255,255,255,0.85)' },

    // Card
    card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    rowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
    rowIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceAlt, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    rowIcon: { fontSize: 18 },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: FONT.xs, color: COLORS.textMuted, marginBottom: 2 },
    rowValue: { fontSize: FONT.base, fontWeight: '600', color: COLORS.textPrimary },
    chevron: { fontSize: FONT.xl, color: COLORS.textMuted },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, width: '80%', maxWidth: 320, ...SHADOW.lg },
    modalTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
    modalMessage: { fontSize: FONT.base, color: COLORS.textMuted, marginBottom: SPACING.lg },
    modalButtons: { flexDirection: 'row', gap: SPACING.md },
    modalBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center' },
    cancelBtn: { backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border },
    cancelBtnText: { color: COLORS.textPrimary, fontWeight: '600', fontSize: FONT.base },
    logoutBtn: { backgroundColor: COLORS.danger },
    logoutBtnText: { color: COLORS.textInverse, fontWeight: '600', fontSize: FONT.base },
});
