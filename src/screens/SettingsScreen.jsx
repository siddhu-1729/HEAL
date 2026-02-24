import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, Switch, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { useAppTheme } from '../context/AppContext';

const LANG_MAP = { English: 'en', Telugu: 'te', Hindi: 'hi', Tamil: 'ta' };
const LANG_LABELS = { en: 'English', te: 'Telugu', hi: 'Hindi', ta: 'Tamil' };

const SETTINGS_SECTIONS = [
    {
        title: 'Notifications',
        items: [
            { id: 'medicine', icon: '💊', label: 'Medicine Reminders', sub: 'Get notified to take your medicines', toggle: true, default: true },
            { id: 'workout', icon: '🏃', label: 'Workout Reminders', sub: 'Daily fitness activity alerts', toggle: true, default: true },
            { id: 'healthTip', icon: '💡', label: 'Health Tips', sub: 'Daily health & wellness tips', toggle: true, default: false },
            { id: 'appt', icon: '📅', label: 'Appointment Alerts', sub: 'Upcoming appointment reminders', toggle: true, default: true },
        ],
    },
    {
        title: 'Privacy & Data',
        items: [
            { id: 'healthSync', icon: '❤️', label: 'Health Sync', sub: 'Sync with device sensors', toggle: true, default: true },
            { id: 'dataShare', icon: '🔗', label: 'Share with Doctor', sub: 'Allow doctor to view your reports', toggle: true, default: false },
            { id: 'analytics', icon: '📊', label: 'App Analytics', sub: 'Help improve the app (anonymous)', toggle: true, default: true },
        ],
    },
    {
        title: 'Support',
        items: [
            { id: 'help', icon: '💬', label: 'Help & Support', sub: 'FAQs and contact us', toggle: false, action: () => Alert.alert('Help', 'Opening support...') },
            { id: 'privacy', icon: '🔒', label: 'Privacy Policy', sub: 'Read our privacy terms', toggle: false, action: () => Alert.alert('Privacy', 'Opening...') },
            { id: 'terms', icon: '📄', label: 'Terms of Service', sub: 'App terms & conditions', toggle: false, action: () => Alert.alert('Terms', 'Opening...') },
            { id: 'rate', icon: '⭐', label: 'Rate the App', sub: 'Share your feedback', toggle: false, action: () => Alert.alert('Rate', 'Opening store...') },
            { id: 'version', icon: 'ℹ️', label: 'App Version', sub: 'Heal-verse v1.0.0', toggle: false, action: () => { } },
        ],
    },
];

export default function SettingsScreen({ navigation }) {
    const { isDark, toggleDark, language, changeLanguage } = useAppTheme();
    const selectedLang = LANG_LABELS[language] ?? 'English';
    const setSelectedLang = (label) => changeLanguage(LANG_MAP[label]);
    const darkMode = isDark;
    const setDarkMode = () => toggleDark();

    const initToggles = {};
    SETTINGS_SECTIONS.forEach(sec => sec.items.forEach(i => { if (i.toggle) initToggles[i.id] = i.default; }));
    const [toggles, setToggles] = useState(initToggles);
    const setToggle = (id, val) => setToggles(prev => ({ ...prev, [id]: val }));

    const LANGUAGES = Object.keys(LANG_MAP);

    return (
        <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#0F172A' }]}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>

                {/* Header */}
                <LinearGradient colors={COLORS.gradPurple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIconWrap}>
                        <Text style={styles.headerMainIcon}>⚙️</Text>
                    </View>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSub}>Customize your Heal-verse experience</Text>
                </LinearGradient>

                {/* ── Language ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Language</Text>
                    <View style={styles.card}>
                        <View style={styles.langHeader}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🌐</Text></View>
                            <Text style={styles.rowValue}>Select Language</Text>
                        </View>
                        <View style={styles.langChips}>
                            {LANGUAGES.map(lang => (
                                <TouchableOpacity
                                    key={lang}
                                    style={[styles.langChip, selectedLang === lang && styles.langChipActive]}
                                    onPress={() => setSelectedLang(lang)}
                                >
                                    <Text style={[styles.langTxt, selectedLang === lang && styles.langTxtActive]}>{lang}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ── Appearance ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🌙</Text></View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowValue}>Dark Mode</Text>
                                <Text style={styles.rowSub}>Switch to dark theme</Text>
                            </View>
                            <Switch value={darkMode} onValueChange={setDarkMode}
                                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                                thumbColor={COLORS.surface} />
                        </View>
                    </View>
                </View>

                {/* ── Dynamic Sections ── */}
                {SETTINGS_SECTIONS.map(sec => (
                    <View key={sec.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{sec.title}</Text>
                        <View style={styles.card}>
                            {sec.items.map((item, i) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.settingRow, i > 0 && styles.rowBorder]}
                                    onPress={!item.toggle ? item.action : undefined}
                                    activeOpacity={item.toggle ? 1 : 0.7}
                                >
                                    <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>{item.icon}</Text></View>
                                    <View style={styles.rowContent}>
                                        <Text style={styles.rowValue}>{item.label}</Text>
                                        <Text style={styles.rowSub}>{item.sub}</Text>
                                    </View>
                                    {item.toggle ? (
                                        <Switch
                                            value={toggles[item.id]}
                                            onValueChange={v => setToggle(item.id, v)}
                                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                                            thumbColor={COLORS.surface}
                                        />
                                    ) : (
                                        <Text style={styles.chevron}>›</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* ── Danger Zone ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.settingRow}
                            onPress={() => Alert.alert('Delete Account', 'This action is irreversible. Are you sure?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive' },
                            ])}>
                            <View style={[styles.rowIconWrap, { backgroundColor: COLORS.dangerLight }]}>
                                <Text style={styles.rowIcon}>🗑️</Text>
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={[styles.rowValue, { color: COLORS.danger }]}>Delete Account</Text>
                                <Text style={styles.rowSub}>Permanently remove your data</Text>
                            </View>
                            <Text style={[styles.chevron, { color: COLORS.danger }]}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerTxt}>Heal-verse · v1.0.0</Text>
                    <Text style={styles.footerSub}>Made with ❤️ for your health</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },

    header: { paddingTop: SPACING.xl, paddingBottom: SPACING.xxxl, alignItems: 'center', paddingHorizontal: SPACING.lg },
    backBtn: { position: 'absolute', top: SPACING.lg, left: SPACING.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 28, color: COLORS.textInverse, lineHeight: 32 },
    headerIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 12 },
    headerMainIcon: { fontSize: 30 },
    headerTitle: { fontSize: FONT.xxl, fontWeight: '700', color: COLORS.textInverse, marginBottom: 6 },
    headerSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

    sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },

    card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },

    langHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    langChips: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md, gap: SPACING.sm },
    langChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceAlt, borderWidth: 1.5, borderColor: COLORS.border },
    langChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    langTxt: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
    langTxtActive: { color: COLORS.textInverse },

    settingRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
    rowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
    rowIconWrap: { width: 38, height: 38, borderRadius: RADIUS.sm, backgroundColor: COLORS.surfaceAlt, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    rowIcon: { fontSize: 18 },
    rowContent: { flex: 1 },
    rowValue: { fontSize: FONT.base, fontWeight: '600', color: COLORS.textPrimary },
    rowSub: { fontSize: FONT.xs, color: COLORS.textMuted, marginTop: 1 },
    chevron: { fontSize: FONT.xl, color: COLORS.textMuted },

    footer: { alignItems: 'center', marginTop: SPACING.xxxl },
    footerTxt: { fontSize: FONT.sm, color: COLORS.textMuted, fontWeight: '600' },
    footerSub: { fontSize: FONT.xs, color: COLORS.textMuted, marginTop: 4 },
});
