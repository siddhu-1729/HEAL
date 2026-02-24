import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, FlatList, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const ADVICE_DATA = [
    {
        id: '1',
        category: 'Brain Health',
        icon: '🧠',
        riskLevel: 'High',
        title: 'High Tumor Probability Detected',
        advice: 'Your recent brain scan shows a high probability of abnormality. HealVerse AI has detected critical patterns. Immediate action is required based on the analysis below.',
        caution: 'Do not delay. Early detection significantly improves treatment outcomes.',
        note: 'Open the Script Analyzer to log your current medicines. HealVerse AI will cross-check them against your scan findings.',
        date: 'Feb 24, 2026',
        colors: COLORS.gradBrain,
    },
    {
        id: '2',
        category: 'Bone Health',
        icon: '🦴',
        riskLevel: 'Moderate',
        title: 'Moderate Bone Density Concern',
        advice: 'Your bone scan indicates moderate density reduction. Increase calcium and Vitamin D intake. Schedule a follow-up in 2–4 weeks.',
        caution: 'Avoid high-impact activities that may stress the affected area.',
        note: 'A diet rich in dairy, leafy greens, and sunlight exposure can help improve density.',
        date: 'Feb 20, 2026',
        colors: COLORS.gradBone,
    },
    {
        id: '3',
        category: 'General Wellness',
        icon: '💡',
        riskLevel: 'Low',
        title: 'Maintain Your Healthy Routine',
        advice: 'Your cellular scan results are within normal range. Continue your current lifestyle and attend routine check-ups every 6 months.',
        caution: null,
        note: 'Stay hydrated, sleep 7–8 hours, and aim for 30 minutes of physical activity daily.',
        date: 'Feb 15, 2026',
        colors: COLORS.gradSuccess,
    },
    {
        id: '4',
        category: 'Medication',
        icon: '💊',
        riskLevel: 'Moderate',
        title: 'TB Medication Adherence Warning',
        advice: 'It appears you may have missed doses of your prescribed TB medication. Consistent dosing is critical to prevent drug resistance.',
        caution: 'Skipping TB medication can lead to multi-drug resistant TB (MDR-TB), which is much harder to treat.',
        note: 'Set daily alarms using the Script Analyzer module. HealVerse will track your adherence and flag missed doses automatically.',
        date: 'Feb 18, 2026',
        colors: COLORS.gradWarning,
    },
    {
        id: '5',
        category: 'Recovery',
        icon: '🏃',
        riskLevel: 'Low',
        title: 'Injury Recovery Progress',
        advice: 'Your injury recovery is progressing well. Continue physiotherapy exercises as prescribed and gradually increase activity level.',
        caution: null,
        note: 'Avoid full-weight bearing until cleared by HealVerse recovery tracker. Ice the area after exercises.',
        date: 'Feb 10, 2026',
        colors: COLORS.gradAccent,
    },
];

const RISK_STYLE = {
    High: { bg: COLORS.dangerLight, text: '#7F1D1D', border: COLORS.danger },
    Moderate: { bg: COLORS.warningLight, text: '#78350F', border: COLORS.warning },
    Low: { bg: COLORS.successLight, text: '#14532D', border: COLORS.success },
};

export default function AdviceCautionScreen({ navigation }) {
    const [filter, setFilter] = useState('All');
    const filters = ['All', 'High', 'Moderate', 'Low'];

    const filtered = filter === 'All' ? ADVICE_DATA : ADVICE_DATA.filter(a => a.riskLevel === filter);

    const renderCard = ({ item }) => {
        const rs = RISK_STYLE[item.riskLevel];
        return (
            <View style={[styles.adviceCard, { borderLeftColor: rs.border }]}>
                {/* Card header */}
                <View style={styles.cardHeader}>
                    <LinearGradient colors={item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIconBox}>
                        <Text style={styles.cardIcon}>{item.icon}</Text>
                    </LinearGradient>
                    <View style={styles.cardMeta}>
                        <Text style={styles.cardCategory}>{item.category}</Text>
                        <Text style={styles.cardDate}>📅 {item.date}</Text>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: rs.bg }]}>
                        <Text style={[styles.riskBadgeTxt, { color: rs.text }]}>{item.riskLevel}</Text>
                    </View>
                </View>

                {/* Title + Advice */}
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardAdvice}>{item.advice}</Text>

                {/* Caution */}
                {item.caution && (
                    <View style={styles.cautionBox}>
                        <Text style={styles.cautionIcon}>⚠️</Text>
                        <Text style={styles.cautionTxt}>{item.caution}</Text>
                    </View>
                )}

                {/* Note */}
                <View style={styles.noteBox}>
                    <Text style={styles.noteIcon}>📝</Text>
                    <Text style={styles.noteTxt}>{item.note}</Text>
                </View>

                {/* Action */}
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => Alert.alert('AI Deep Insights', 'Running advanced analysis on your health data...')}
                >
                    <Text style={styles.actionBtnTxt}>🤖  Get AI Deep Insights</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>

                {/* Header */}
                <LinearGradient colors={['#F093FB', '#F5576C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIconWrap}>
                        <Text style={styles.headerMainIcon}>💬</Text>
                    </View>
                    <Text style={styles.headerTitle}>Advice & Caution</Text>
                    <Text style={styles.headerSub}>AI-generated health advice based on your reports</Text>
                </LinearGradient>

                {/* Summary strip */}
                <View style={styles.summaryStrip}>
                    {[
                        { label: 'High Risk', val: ADVICE_DATA.filter(a => a.riskLevel === 'High').length, color: COLORS.danger },
                        { label: 'Moderate', val: ADVICE_DATA.filter(a => a.riskLevel === 'Moderate').length, color: COLORS.warning },
                        { label: 'Low Risk', val: ADVICE_DATA.filter(a => a.riskLevel === 'Low').length, color: COLORS.success },
                    ].map((s, i) => (
                        <React.Fragment key={s.label}>
                            {i > 0 && <View style={styles.summaryDivider} />}
                            <View style={styles.summaryItem}>
                                <Text style={[styles.summaryVal, { color: s.color }]}>{s.val}</Text>
                                <Text style={styles.summaryKey}>{s.label}</Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>

                {/* Filter chips */}
                <View style={styles.filterRow}>
                    {filters.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterTxt, filter === f && styles.filterTxtActive]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Cards */}
                <View style={styles.section}>
                    <FlatList
                        data={filtered}
                        renderItem={renderCard}
                        keyExtractor={i => i.id}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyIcon}>✅</Text>
                                <Text style={styles.emptyTxt}>No advice for this risk level</Text>
                            </View>
                        }
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.md },

    header: { paddingTop: SPACING.xl, paddingBottom: SPACING.xxxl, alignItems: 'center', paddingHorizontal: SPACING.lg },
    backBtn: { position: 'absolute', top: SPACING.lg, left: SPACING.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 28, color: COLORS.textInverse, lineHeight: 32 },
    headerIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 12 },
    headerMainIcon: { fontSize: 30 },
    headerTitle: { fontSize: FONT.xxl, fontWeight: '700', color: COLORS.textInverse, marginBottom: 6 },
    headerSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

    summaryStrip: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, marginTop: SPACING.xxl, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.sm },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryVal: { fontSize: FONT.xxl, fontWeight: '800', marginBottom: 2 },
    summaryKey: { fontSize: FONT.xs, color: COLORS.textMuted },
    summaryDivider: { width: 1, backgroundColor: COLORS.border },

    filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, gap: SPACING.sm },
    filterChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterTxt: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
    filterTxtActive: { color: COLORS.textInverse },

    adviceCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderLeftWidth: 4, ...SHADOW.sm },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    cardIconBox: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    cardIcon: { fontSize: 22 },
    cardMeta: { flex: 1 },
    cardCategory: { fontSize: FONT.xs, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    cardDate: { fontSize: FONT.xs, color: COLORS.textMuted },
    riskBadge: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
    riskBadgeTxt: { fontSize: 10, fontWeight: '700' },

    cardTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
    cardAdvice: { fontSize: FONT.sm, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.md },

    cautionBox: { flexDirection: 'row', backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, alignItems: 'flex-start' },
    cautionIcon: { fontSize: 14, marginRight: SPACING.sm, marginTop: 2 },
    cautionTxt: { flex: 1, fontSize: FONT.sm, color: '#7F1D1D', lineHeight: 18 },

    noteBox: { flexDirection: 'row', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, alignItems: 'flex-start' },
    noteIcon: { fontSize: 14, marginRight: SPACING.sm, marginTop: 2 },
    noteTxt: { flex: 1, fontSize: FONT.sm, color: COLORS.primary, lineHeight: 18 },

    actionBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', ...SHADOW.sm },
    actionBtnTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },

    emptyBox: { alignItems: 'center', paddingVertical: SPACING.xxxl },
    emptyIcon: { fontSize: 40, marginBottom: SPACING.md },
    emptyTxt: { fontSize: FONT.base, color: COLORS.textMuted },
});
