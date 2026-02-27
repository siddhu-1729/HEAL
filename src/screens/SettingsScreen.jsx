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

const getSettingsSections = (strings) => [
    {
        title: strings.notifsTitle,
        items: [
            { id: 'medicine', icon: '💊', label: strings.medReminders, sub: strings.medSub, toggle: true, default: true },
            { id: 'workout', icon: '🏃', label: strings.workoutReminders, sub: strings.workoutSub, toggle: true, default: true },
            { id: 'healthTip', icon: '💡', label: strings.healthTips, sub: strings.healthTipsSub, toggle: true, default: false },
            { id: 'appt', icon: '📅', label: strings.apptAlerts, sub: strings.apptSub, toggle: true, default: true },
        ],
    },
    {
        title: strings.privacyTitle,
        items: [
            { id: 'healthSync', icon: '❤️', label: strings.healthSync, sub: strings.healthSyncSub, toggle: true, default: true },
            { id: 'dataShare', icon: '🔗', label: strings.shareDoc, sub: strings.shareDocSub, toggle: true, default: false },
            { id: 'analytics', icon: '📊', label: strings.appAnalytics, sub: strings.appAnalyticsSub, toggle: true, default: true },
        ],
    },
    {
        title: strings.supportTitle,
        items: [
            { id: 'help', icon: '💬', label: strings.helpSupport, sub: strings.helpSub, toggle: false, action: () => Alert.alert('Help', 'Opening support...') },
            { id: 'privacy', icon: '🔒', label: strings.privacyPolicy, sub: strings.privacySub, toggle: false, action: () => Alert.alert('Privacy', 'Opening...') },
            { id: 'terms', icon: '📄', label: strings.terms, sub: strings.termsSub, toggle: false, action: () => Alert.alert('Terms', 'Opening...') },
            { id: 'rate', icon: '⭐', label: strings.rateApp, sub: strings.rateSub, toggle: false, action: () => Alert.alert('Rate', 'Opening store...') },
            { id: 'version', icon: 'ℹ️', label: strings.appVersion, sub: strings.appVersionSub, toggle: false, action: () => { } },
        ],
    },
];

export default function SettingsScreen({ navigation }) {
    const { isDark, toggleDark, language, changeLanguage, strings } = useAppTheme();
    const selectedLang = LANG_LABELS[language] ?? 'English';
    const setSelectedLang = (label) => changeLanguage(LANG_MAP[label]);
    const darkMode = isDark;
    const setDarkMode = () => toggleDark();

    const SECTIONS = getSettingsSections(strings);

    const [toggles, setToggles] = useState(() => {
        const initToggles = {};
        SECTIONS.forEach(sec => sec.items.forEach(i => { if (i.toggle) initToggles[i.id] = i.default; }));
        return initToggles;
    });
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
                    <Text style={styles.headerTitle}>{strings.settings}</Text>
                    <Text style={styles.headerSub}>{strings.customizeSettings}</Text>
                </LinearGradient>

                {/* ── Language ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{strings.language}</Text>
                    <View style={styles.card}>
                        <View style={styles.langHeader}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🌐</Text></View>
                            <Text style={styles.rowValue}>{strings.selectLanguage}</Text>
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
                    <Text style={styles.sectionTitle}>{strings.appearance}</Text>
                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.rowIconWrap}><Text style={styles.rowIcon}>🌙</Text></View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowValue}>{strings.darkMode}</Text>
                                <Text style={styles.rowSub}>{strings.switchDark}</Text>
                            </View>
                            <Switch value={darkMode} onValueChange={setDarkMode}
                                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                                thumbColor={COLORS.surface} />
                        </View>
                    </View>
                </View>

                {/* ── Dynamic Sections ── */}
                {SECTIONS.map(sec => (
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
                    <Text style={styles.sectionTitle}>{strings.accountTitle}</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.settingRow}
                            onPress={() => Alert.alert(strings.deleteAccount, 'This action is irreversible. Are you sure?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive' },
                            ])}>
                            <View style={[styles.rowIconWrap, { backgroundColor: COLORS.dangerLight }]}>
                                <Text style={styles.rowIcon}>🗑️</Text>
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={[styles.rowValue, { color: COLORS.danger }]}>{strings.deleteAccount}</Text>
                                <Text style={styles.rowSub}>{strings.deleteSub}</Text>
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
