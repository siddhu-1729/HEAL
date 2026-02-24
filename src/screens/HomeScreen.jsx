import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, FlatList, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import scheduleDailyNotification from '../services/notification';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';


const QUICK_ACTIONS = [
  { id: 1, title: 'AI Scan', subtitle: 'Upload & Analyse', icon: '🔬', color: COLORS.gradBrain },
  { id: 2, title: 'Records', subtitle: 'Medical History', icon: '📋', color: COLORS.gradPink },
  { id: 3, title: 'AI Assistant', subtitle: 'Ask HealVerse', icon: '🤖', color: COLORS.gradAccent },
  { id: 4, title: 'Scripts', subtitle: 'Prescriptions', icon: '💊', color: COLORS.gradSuccess },
];

const HEALTH_METRICS = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: '❤️', color: COLORS.danger },
  { label: 'BP', value: '120/80', unit: 'mmHg', icon: '📊', color: COLORS.primary },
  { label: 'Temp', value: '98.6', unit: '°F', icon: '🌡️', color: COLORS.warning },
];

const UPCOMING_APPOINTMENTS = [
  { id: 1, doctorName: 'AI Brain Scan Analysis', specialty: 'Neuro-AI Module', date: 'Today', time: '2:30 PM', initials: '🧠' },
  { id: 2, doctorName: 'AI Bone Density Report', specialty: 'Ortho-AI Module', date: 'Tomorrow', time: '10:00 AM', initials: '🦴' },
];

export default function HomeScreen({ navigation }) {
  const [userName] = useState('User');

  const handleQuickAction = (id) => {
    if (id === 1) navigation.navigate('Upload');
    else if (id === 2) navigation.navigate('History');
    else if (id === 3) navigation.navigate('AdviceCaution');
    else if (id === 4) navigation.navigate('ScriptAnalyzer');
  };

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction(item.id)} activeOpacity={0.8}>
      <LinearGradient colors={item.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionGradient}>
        <Text style={styles.actionEmoji}>{item.icon}</Text>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionSub}>{item.subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMetric = ({ item }) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricEmoji}>{item.icon}</Text>
      <Text style={styles.metricLabel}>{item.label}</Text>
      <View style={styles.metricValRow}>
        <Text style={[styles.metricVal, { color: item.color }]}>{item.value}</Text>
      </View>
      <Text style={styles.metricUnit}>{item.unit}</Text>
    </View>
  );

  const renderAppointment = ({ item }) => (
    <TouchableOpacity style={styles.apptCard} activeOpacity={0.8}>
      <View style={[styles.apptAvatar, { backgroundColor: COLORS.primaryLight }]}>
        <Text style={styles.apptInitials}>{item.initials}</Text>
      </View>
      <View style={styles.apptContent}>
        <Text style={styles.apptName}>{item.doctorName}</Text>
        <Text style={styles.apptSpec}>{item.specialty}</Text>
        <View style={styles.apptTimePill}>
          <Text style={styles.apptTimeText}>🕐 {item.date} · {item.time}</Text>
        </View>
      </View>
      <Text style={styles.apptChevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hello, {userName} 👋</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.bellBadge}><Text style={styles.bellBadgeTxt}>2</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Profile')}>
              <LinearGradient colors={COLORS.gradPrimary} style={styles.avatarGrad}>
                <Text style={styles.avatarText}>U</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Health status banner ── */}
        <View style={styles.px}>
          <LinearGradient colors={COLORS.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statusBanner}>
            <View style={styles.statusLeft}>
              <Text style={styles.statusLabel}>Your Health Status</Text>
              <Text style={styles.statusValue}>Excellent 🎉</Text>
              <Text style={styles.statusSub}>All vitals in normal range</Text>
            </View>
            <TouchableOpacity style={styles.statusBtn}>
              <Text style={styles.statusBtnText}>View →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ── Quick actions ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={QUICK_ACTIONS} renderItem={renderQuickAction}
            keyExtractor={i => i.id.toString()} numColumns={2}
            columnWrapperStyle={styles.actionRow} scrollEnabled={false}
          />
        </View>

        {/* ── Health metrics ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
            <TouchableOpacity onPress={() => navigation.navigate('fitness')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={HEALTH_METRICS} renderItem={renderMetric}
            keyExtractor={i => i.label} numColumns={3}
            columnWrapperStyle={styles.metricRow} scrollEnabled={false}
          />
        </View>

        {/* ── Upcoming appointments ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all →</Text></TouchableOpacity>
          </View>
          <FlatList
            data={UPCOMING_APPOINTMENTS} renderItem={renderAppointment}
            keyExtractor={i => i.id.toString()} scrollEnabled={false}
          />
        </View>

        {/* ── Emergency ── */}
        <View style={styles.px}>
          <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.85}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>Emergency Contact</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  px: { paddingHorizontal: SPACING.lg },

  // Top bar
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md,
  },
  greeting: { fontSize: FONT.h1, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  dateText: { fontSize: FONT.sm, color: COLORS.textSecondary },
  avatarBtn: { borderRadius: RADIUS.full, overflow: 'hidden', ...SHADOW.md },
  avatarGrad: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.lg },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  bellBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', ...SHADOW.sm, position: 'relative' },
  bellIcon: { fontSize: 18 },
  bellBadge: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.danger, justifyContent: 'center', alignItems: 'center' },
  bellBadgeTxt: { color: COLORS.textInverse, fontSize: 9, fontWeight: '800' },

  // Status banner
  statusBanner: { borderRadius: RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', marginBottom: 4, ...SHADOW.md },
  statusLeft: { flex: 1 },
  statusLabel: { fontSize: FONT.xs, color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  statusValue: { fontSize: FONT.xl, fontWeight: '700', color: COLORS.textInverse, marginBottom: 4 },
  statusSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.75)' },
  statusBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  statusBtnText: { color: COLORS.textInverse, fontSize: FONT.sm, fontWeight: '700' },

  // Section
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  seeAll: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '700' },

  // Quick actions
  actionRow: { justifyContent: 'space-between', marginBottom: SPACING.md },
  actionCard: { width: '48%', borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.md },
  actionGradient: { paddingVertical: SPACING.xl, paddingHorizontal: SPACING.md, alignItems: 'center', minHeight: 120, justifyContent: 'center' },
  actionEmoji: { fontSize: 30, marginBottom: 8 },
  actionTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textInverse },
  actionSub: { fontSize: FONT.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Metrics
  metricRow: { justifyContent: 'space-between', marginBottom: SPACING.md },
  metricCard: { width: '31%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
  metricEmoji: { fontSize: 24, marginBottom: 6 },
  metricLabel: { fontSize: FONT.xs, color: COLORS.textMuted, textAlign: 'center', marginBottom: 4 },
  metricValRow: { flexDirection: 'row', alignItems: 'baseline' },
  metricVal: { fontSize: FONT.lg, fontWeight: '700' },
  metricUnit: { fontSize: 9, color: COLORS.textMuted, marginTop: 2 },

  // Appointments
  apptCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, flexDirection: 'row',
    alignItems: 'center', ...SHADOW.sm,
  },
  apptAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  apptInitials: { fontSize: FONT.md, fontWeight: '700', color: COLORS.primary },
  apptContent: { flex: 1 },
  apptName: { fontSize: FONT.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  apptSpec: { fontSize: FONT.xs, color: COLORS.textSecondary, marginBottom: 6 },
  apptTimePill: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  apptTimeText: { fontSize: FONT.xs, color: COLORS.primary, fontWeight: '600' },
  apptChevron: { fontSize: FONT.xl, color: COLORS.textMuted },

  // Emergency
  emergencyBtn: {
    marginTop: SPACING.xxl, backgroundColor: COLORS.danger, borderRadius: RADIUS.lg,
    padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...SHADOW.md,
  },
  emergencyIcon: { fontSize: FONT.xl, marginRight: SPACING.sm },
  emergencyText: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textInverse },
});
