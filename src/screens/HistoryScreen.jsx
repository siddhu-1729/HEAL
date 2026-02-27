import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { useAppTheme } from '../context/AppContext';

const getHistoryData = (s) => [
    { id: '1', scanType: 'brain', label: s.brainScan, icon: '🧠', risk: 'High', probability: 82, date: 'Feb 24, 2026', time: '6:30 PM', status: s.reviewed, colors: COLORS.gradBrain },
    { id: '2', scanType: 'bone', label: s.boneScan, icon: '🦴', risk: 'Moderate', probability: 45, date: 'Feb 20, 2026', time: '11:00 AM', status: s.pending, colors: COLORS.gradBone },
    { id: '3', scanType: 'cellular', label: s.cellularScan, icon: '🔬', risk: 'Low', probability: 21, date: 'Feb 15, 2026', time: '3:45 PM', status: s.reviewed, colors: COLORS.gradCellular },
    { id: '4', scanType: 'brain', label: s.brainScan, icon: '🧠', risk: 'Moderate', probability: 58, date: 'Feb 10, 2026', time: '9:00 AM', status: s.reviewed, colors: COLORS.gradBrain },
    { id: '5', scanType: 'bone', label: s.boneScan, icon: '🦴', risk: 'Low', probability: 18, date: 'Jan 30, 2026', time: '2:00 PM', status: s.reviewed, colors: COLORS.gradBone },
];

const DUMMY_RESULT = {
    brain: { probability: 0.82, risk_level: 'High', recommendation: 'Immediate consultation with a neurologist is advised.', progression_status: 'Progressive' },
    bone: { probability: 0.45, risk_level: 'Moderate', recommendation: 'Monitor bone density closely.', progression_status: 'Stable' },
    cellular: { probability: 0.21, risk_level: 'Low', recommendation: 'No immediate action required.', progression_status: 'Normal' },
};

const RISK_COLORS = { High: COLORS.danger, Moderate: COLORS.warning, Low: COLORS.success };
const RISK_BG = { High: COLORS.dangerLight, Moderate: COLORS.warningLight, Low: COLORS.successLight };
const RISK_TEXT = { High: '#7F1D1D', Moderate: '#78350F', Low: '#14532D' };

const getStats = (s, data) => [
    { label: s.totalScans, value: data.length.toString(), icon: '📊', color: COLORS.primary },
    { label: s.highRisk, value: data.filter(h => h.risk === 'High').length.toString(), icon: '⚠️', color: COLORS.danger },
    { label: s.reviewed, value: data.filter(h => h.status === s.reviewed).length.toString(), icon: '✅', color: COLORS.success },
];

export default function HistoryScreen({ navigation }) {
    const { strings } = useAppTheme();
    const [filter, setFilter] = useState('All');

    const HISTORY_DATA = getHistoryData(strings);
    const STATS = getStats(strings, HISTORY_DATA);
    const filters = [{ key: 'All', label: strings.all }, { key: 'High', label: strings.high }, { key: 'Moderate', label: strings.moderate }, { key: 'Low', label: strings.low }];

    const filtered = filter === 'All' ? HISTORY_DATA : HISTORY_DATA.filter(h => h.risk === filter);

    const renderItem = ({ item, index }) => (
        <View style={styles.timelineRow}>
            {/* Timeline line + dot */}
            <View style={styles.timelineLeft}>
                <LinearGradient colors={item.colors} style={styles.timelineDot} />
                {index < filtered.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Card */}
            <TouchableOpacity
                style={styles.histCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Result', { scanType: item.scanType, result: DUMMY_RESULT[item.scanType] })}
            >
                <View style={styles.histCardTop}>
                    <LinearGradient colors={item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.histIconBox}>
                        <Text style={styles.histIcon}>{item.icon}</Text>
                    </LinearGradient>
                    <View style={styles.histInfo}>
                        <Text style={styles.histLabel}>{item.label}</Text>
                        <Text style={styles.histDate}>📅 {item.date}  ·  {item.time}</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: item.status === strings.reviewed ? COLORS.successLight : COLORS.warningLight }]}>
                        <Text style={[styles.statusTxt, { color: item.status === strings.reviewed ? '#065F46' : '#78350F' }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.histCardBottom}>
                    <View style={[styles.riskPill, { backgroundColor: RISK_BG[item.risk] }]}>
                        <Text style={[styles.riskTxt, { color: RISK_TEXT[item.risk] }]}>{strings[item.risk.toLowerCase()] || item.risk} {strings.riskLabel}</Text>
                    </View>
                    <View style={styles.probRow}>
                        <View style={styles.probBarBg}>
                            <View style={[styles.probBarFill, { width: `${item.probability}%`, backgroundColor: RISK_COLORS[item.risk] }]} />
                        </View>
                        <Text style={[styles.probPct, { color: RISK_COLORS[item.risk] }]}>{item.probability}%</Text>
                    </View>
                </View>
                <Text style={styles.histTapHint}>{strings.tapToView}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <LinearGradient colors={COLORS.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIconWrap}>
                        <Text style={styles.headerMainIcon}>📋</Text>
                    </View>
                    <Text style={styles.headerTitle}>{strings.scanHistory}</Text>
                    <Text style={styles.headerSub}>{strings.scanHistorySub}</Text>
                </LinearGradient>

                {/* Stats row */}
                <View style={styles.statsRow}>
                    {STATS.map(s => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statIcon}>{s.icon}</Text>
                            <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Filter chips */}
                <View style={styles.filterRow}>
                    {filters.map(f => (
                        <TouchableOpacity
                            key={f.key}
                            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
                            onPress={() => setFilter(f.key)}
                        >
                            <Text style={[styles.filterTxt, filter === f.key && styles.filterTxtActive]}>{f.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Timeline */}
                <View style={styles.section}>
                    <FlatList
                        data={filtered}
                        renderItem={renderItem}
                        keyExtractor={i => i.id}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyIcon}>🔍</Text>
                                <Text style={styles.emptyTxt}>No scans found for this filter</Text>
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

    statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl, gap: SPACING.md },
    statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
    statIcon: { fontSize: 22, marginBottom: 6 },
    statVal: { fontSize: FONT.xxl, fontWeight: '800', marginBottom: 2 },
    statLabel: { fontSize: FONT.xs, color: COLORS.textMuted, textAlign: 'center' },

    filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, gap: SPACING.sm },
    filterChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterTxt: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
    filterTxtActive: { color: COLORS.textInverse },

    timelineRow: { flexDirection: 'row', marginBottom: SPACING.md },
    timelineLeft: { width: 28, alignItems: 'center', paddingTop: 18 },
    timelineDot: { width: 14, height: 14, borderRadius: 7 },
    timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4 },

    histCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginLeft: SPACING.sm, ...SHADOW.sm },
    histCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    histIconBox: { width: 42, height: 42, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    histIcon: { fontSize: 20 },
    histInfo: { flex: 1 },
    histLabel: { fontSize: FONT.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
    histDate: { fontSize: FONT.xs, color: COLORS.textMuted },
    statusPill: { borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
    statusTxt: { fontSize: 10, fontWeight: '700' },
    histCardBottom: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    riskPill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
    riskTxt: { fontSize: FONT.xs, fontWeight: '700' },
    probRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    probBarBg: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
    probBarFill: { height: '100%', borderRadius: 3 },
    probPct: { fontSize: FONT.sm, fontWeight: '700', minWidth: 34, textAlign: 'right' },
    histTapHint: { fontSize: FONT.xs, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'right' },

    emptyBox: { alignItems: 'center', paddingVertical: SPACING.xxxl },
    emptyIcon: { fontSize: 40, marginBottom: SPACING.md },
    emptyTxt: { fontSize: FONT.base, color: COLORS.textMuted },
});
