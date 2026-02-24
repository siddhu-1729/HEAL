import React from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const RISK_CONFIG = {
    High: { gradColors: COLORS.gradDanger, icon: '⚠️', bgLight: COLORS.dangerLight, textC: '#7F1D1D', meterColor: COLORS.danger },
    Moderate: { gradColors: COLORS.gradWarning, icon: '⚡', bgLight: COLORS.warningLight, textC: '#78350F', meterColor: COLORS.warning },
    Low: { gradColors: COLORS.gradSuccess, icon: '✅', bgLight: COLORS.successLight, textC: '#14532D', meterColor: COLORS.success },
};

const SCAN_META = {
    brain: { label: 'Brain Scan', icon: '🧠' },
    bone: { label: 'Bone Scan', icon: '🦴' },
    cellular: { label: 'Cellular Scan', icon: '🔬' },
};

const NEXT_STEPS = {
    High: ['Re-upload additional scans for deeper AI analysis', 'Review the Advice & Caution section for steps', 'Activate medicine reminders in Script Analyzer', 'Monitor symptoms and re-scan in 48 hours'],
    Moderate: ['Schedule follow-up within 2–4 weeks', 'Track new or worsening symptoms', 'Continue prescribed medication', 'Adopt healthy diet & rest'],
    Low: ['Schedule an AI wellness re-scan in 6 months', 'Track daily fitness goals in HealVerse', 'Log your medicines in Script Analyzer', 'Review your health history timeline'],
};

export default function ResultScreen({ navigation, route }) {
    const { scanType = 'brain', result = {} } = route?.params ?? {};
    const risk = result.risk_level ?? 'Low';
    const probability = result.probability ?? 0.21;
    const recommendation = result.recommendation ?? '—';
    const progression = result.progression_status ?? 'Normal';

    const cfg = RISK_CONFIG[risk] ?? RISK_CONFIG.Low;
    const scan = SCAN_META[scanType] ?? SCAN_META.brain;
    const steps = NEXT_STEPS[risk] ?? NEXT_STEPS.Low;
    const pct = Math.round(probability * 100);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>

                {/* ── Risk Header ── */}
                <LinearGradient colors={cfg.gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.scanTag}>
                        <Text style={styles.scanTagTxt}>{scan.icon}  {scan.label}</Text>
                    </View>
                    <Text style={styles.riskIcon}>{cfg.icon}</Text>
                    <Text style={styles.riskText}>{risk} Risk Detected</Text>
                    <View style={styles.progressionPill}>
                        <Text style={styles.progressionTxt}>Status: {progression}</Text>
                    </View>
                </LinearGradient>

                {/* ── Probability Card ── */}
                <View style={styles.px}>
                    <View style={[styles.card, styles.probCard]}>
                        <Text style={styles.cardLabel}>AI Confidence Score</Text>
                        <View style={styles.probRow}>
                            <Text style={[styles.probPct, { color: cfg.meterColor }]}>{pct}%</Text>
                            <View style={styles.probRight}>
                                <Text style={styles.probSub}>probability</Text>
                                <Text style={[styles.probRisk, { color: cfg.meterColor }]}>{risk} Risk</Text>
                            </View>
                        </View>
                        {/* fill bar */}
                        <View style={styles.barBg}>
                            <LinearGradient colors={cfg.gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={[styles.barFill, { width: `${pct}%` }]} />
                        </View>
                        <View style={styles.barLabels}>
                            <Text style={styles.barLow}>0%</Text>
                            <Text style={styles.barHigh}>100%</Text>
                        </View>
                    </View>
                </View>

                {/* ── Risk Meter ── */}
                <View style={styles.px}>
                    <View style={styles.meterRow}>
                        {(['Low', 'Moderate', 'High']).map(l => (
                            <View key={l} style={[styles.meterBlock,
                            {
                                backgroundColor: l === 'Low' ? COLORS.success : l === 'Moderate' ? COLORS.warning : COLORS.danger,
                                opacity: risk === l ? 1 : 0.22
                            }]}>
                                <Text style={styles.meterTxt}>{l}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Recommendation ── */}
                <View style={styles.px}>
                    <View style={[styles.adviceBox, { backgroundColor: cfg.bgLight }]}>
                        <Text style={[styles.adviceTitle, { color: cfg.textC }]}>💡 AI Recommendation</Text>
                        <Text style={[styles.adviceBody, { color: cfg.textC }]}>{recommendation}</Text>
                    </View>
                </View>

                {/* ── Caution (High only) ── */}
                {risk === 'High' && (
                    <View style={styles.px}>
                        <View style={styles.cautionBox}>
                            <Text style={styles.cautionTitle}>🚨 Critical Caution</Text>
                            <Text style={styles.cautionBody}>
                                This result indicates a high probability of a medical condition. Do NOT ignore these findings.
                                HealVerse AI has analyzed your scan. Review insights above.
                            </Text>
                        </View>
                    </View>
                )}

                {/* ── Next Steps ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Suggested Next Steps</Text>
                    <View style={styles.card}>
                        {steps.map((s, i) => (
                            <View key={i} style={[styles.stepRow, i < steps.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.border }]}>
                                <View style={[styles.stepNum, { backgroundColor: cfg.meterColor }]}>
                                    <Text style={styles.stepNumTxt}>{i + 1}</Text>
                                </View>
                                <Text style={styles.stepTxt}>{s}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Action Buttons ── */}
                <View style={styles.px}>
                    <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}
                        onPress={() => Alert.alert('Book Appointment', 'Appointment booking coming soon!')}>
                        <Text style={styles.primaryBtnTxt}>📅  Book Appointment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}
                        onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.secondaryBtnTxt}>Back to Home</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    px: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
    section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xl },
    sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },

    header: { paddingTop: SPACING.xl, paddingBottom: SPACING.xxxl, alignItems: 'center', paddingHorizontal: SPACING.lg },
    backBtn: { position: 'absolute', top: SPACING.lg, left: SPACING.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 28, color: COLORS.textInverse, lineHeight: 32 },
    scanTag: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8, marginBottom: 14 },
    scanTagTxt: { color: COLORS.textInverse, fontWeight: '600', fontSize: FONT.sm },
    riskIcon: { fontSize: 48, marginBottom: 10 },
    riskText: { fontSize: FONT.xxl, fontWeight: '700', color: COLORS.textInverse, marginBottom: 10 },
    progressionPill: { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 6 },
    progressionTxt: { color: COLORS.textInverse, fontWeight: '600', fontSize: FONT.sm },

    card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.sm },
    probCard: {},
    cardLabel: { fontSize: FONT.xs, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.md },
    probRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    probPct: { fontSize: FONT.h0 + 10, fontWeight: '800', marginRight: SPACING.md },
    probRight: {},
    probSub: { fontSize: FONT.sm, color: COLORS.textMuted },
    probRisk: { fontSize: FONT.lg, fontWeight: '700' },
    barBg: { height: 12, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden', marginBottom: 6 },
    barFill: { height: '100%', borderRadius: 6 },
    barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    barLow: { fontSize: FONT.xs, color: COLORS.textMuted },
    barHigh: { fontSize: FONT.xs, color: COLORS.textMuted },

    meterRow: { flexDirection: 'row', borderRadius: RADIUS.md, overflow: 'hidden', height: 38, marginTop: SPACING.sm },
    meterBlock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    meterTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },

    adviceBox: { borderRadius: RADIUS.lg, padding: SPACING.lg },
    adviceTitle: { fontSize: FONT.base, fontWeight: '700', marginBottom: 8 },
    adviceBody: { fontSize: FONT.sm, lineHeight: 20 },

    cautionBox: { backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.lg, padding: SPACING.lg, borderLeftWidth: 4, borderLeftColor: COLORS.danger, marginTop: SPACING.lg },
    cautionTitle: { fontSize: FONT.base, fontWeight: '700', color: '#7F1D1D', marginBottom: 6 },
    cautionBody: { fontSize: FONT.sm, color: '#7F1D1D', lineHeight: 20 },

    stepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
    stepNum: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    stepNumTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },
    stepTxt: { flex: 1, fontSize: FONT.sm, color: COLORS.textPrimary, lineHeight: 19 },

    primaryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, alignItems: 'center', ...SHADOW.md, marginBottom: SPACING.md },
    primaryBtnTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.md },
    secondaryBtn: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
    secondaryBtnTxt: { color: COLORS.textPrimary, fontWeight: '600', fontSize: FONT.md },
});
