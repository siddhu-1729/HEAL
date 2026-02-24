import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const USER_DATA = {
    firstName: 'User', lastName: '',
    email: 'user@healverse.com', phone: '+91 98765 43210',
    dateOfBirth: '01/01/1995', gender: 'Male', bloodGroup: 'O+',
    city: 'Mumbai', state: 'Maharashtra',
    address: '123, Health Street, Andheri West',
    emergencyContactName: 'Emergency Contact',
    emergencyContactPhone: '+91 91234 56789',
};

const HEALTH_BADGES = [
    { label: 'Blood Group', value: USER_DATA.bloodGroup, icon: '🩸', colors: COLORS.gradPink },
    { label: 'Gender', value: USER_DATA.gender, icon: '👤', colors: COLORS.gradPrimary },
    { label: 'DOB', value: USER_DATA.dateOfBirth, icon: '🎂', colors: COLORS.gradAccent },
];

const INFO_ITEMS = [
    { icon: '📞', label: 'Phone', value: USER_DATA.phone },
    { icon: '📍', label: 'Location', value: `${USER_DATA.city}, ${USER_DATA.state}` },
    { icon: '🏠', label: 'Address', value: USER_DATA.address },
    { icon: '🚨', label: 'Emergency Contact', value: `${USER_DATA.emergencyContactName} · ${USER_DATA.emergencyContactPhone}` },
];

export default function ProfileScreen({ navigation }) {


    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out', style: 'destructive',
                onPress: () => navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] })
            },
        ]);
    };

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
                            <Text style={styles.avatarText}>{USER_DATA.firstName[0]}</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.heroName}>{USER_DATA.firstName} {USER_DATA.lastName}</Text>
                    <Text style={styles.heroEmail}>{USER_DATA.email}</Text>
                    <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Edit Profile', 'Coming soon!')}>
                        <Text style={styles.editBtnText}>✏️  Edit Profile</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* ── Health Badges ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Summary</Text>
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
                    <Text style={styles.sectionTitle}>Personal Information</Text>
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
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        {[
                            { icon: '⚙️', label: 'Settings', onPress: () => navigation.navigate('Settings') },
                            { icon: '🔒', label: 'Privacy Policy', onPress: () => Alert.alert('Privacy Policy', 'Opening...') },
                            { icon: '💬', label: 'Help & Support', onPress: () => Alert.alert('Help', 'Opening...') },
                            { icon: 'ℹ️', label: 'About App', onPress: () => Alert.alert('Version', 'Heal-verse v1.0.0') },
                        ].map((a, i) => (
                            <TouchableOpacity key={a.label} style={[styles.row, styles.rowBorder]} onPress={a.onPress}>
                                <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>{a.icon}</Text></View>
                                <Text style={[styles.rowValue, { flex: 1 }]}>{a.label}</Text>
                                <Text style={styles.chevron}>›</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.row} onPress={handleLogout}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🚪</Text></View>
                            <Text style={[styles.rowValue, { flex: 1, color: COLORS.danger }]}>Log Out</Text>
                            <Text style={[styles.chevron, { color: COLORS.danger }]}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
    sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },

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

    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    settingIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceAlt, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
});
