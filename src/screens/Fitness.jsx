import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, FlatList, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const DAILY_STATS = [
  { label: 'Steps', value: '7,240', target: '10,000', icon: '👟', pct: 72, color: COLORS.primary },
  { label: 'Calories', value: '1,840', target: '2,200', icon: '🔥', pct: 84, color: COLORS.danger },
  { label: 'Water', value: '6', target: '8', icon: '💧', pct: 75, color: '#00C6AE' },
  { label: 'Sleep', value: '7.2h', target: '8h', icon: '🌙', pct: 90, color: COLORS.gradPurple[0] },
];

const WORKOUTS = [
  { id: '1', name: 'Morning Run', duration: '30 min', calories: 320, type: 'Cardio', icon: '🏃', done: true, colors: COLORS.gradPrimary },
  { id: '2', name: 'Push-Up Circuit', duration: '20 min', calories: 180, type: 'Strength', icon: '💪', done: true, colors: COLORS.gradAccent },
  { id: '3', name: 'Yoga & Stretch', duration: '25 min', calories: 120, type: 'Flex', icon: '🧘', done: false, colors: COLORS.gradPurple },
  { id: '4', name: 'Cycling', duration: '45 min', calories: 450, type: 'Cardio', icon: '🚴', done: false, colors: COLORS.gradBone },
];

const WEEKLY = [
  { day: 'Mon', pct: 95 }, { day: 'Tue', pct: 60 }, { day: 'Wed', pct: 80 },
  { day: 'Thu', pct: 100 }, { day: 'Fri', pct: 45 }, { day: 'Sat', pct: 70 }, { day: 'Sun', pct: 30 },
];

export default function FitnessScreen({ navigation }) {
  const [workouts, setWorkouts] = useState(WORKOUTS);
  const [water, setWater] = useState(6);
  const [showBMI, setShowBMI] = useState(false);
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');

  const toggleWorkout = (id) => setWorkouts(prev => prev.map(w => w.id === id ? { ...w, done: !w.done } : w));
  const doneCount = workouts.filter(w => w.done).length;

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;
  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const bmiColor = bmi < 18.5 ? COLORS.info : bmi < 25 ? COLORS.success : bmi < 30 ? COLORS.warning : COLORS.danger;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.pageTitle}>Fitness</Text>
            <Text style={styles.pageSub}>Today's Activity</Text>
          </View>
          <TouchableOpacity
            style={styles.bmiBtn}
            onPress={() => setShowBMI(s => !s)}
          >
            <Text style={styles.bmiBtnTxt}>⚖️ BMI</Text>
          </TouchableOpacity>
        </View>

        {/* ── BMI Calculator ── */}
        {showBMI && (
          <View style={styles.px}>
            <LinearGradient colors={COLORS.gradPrimary} style={styles.bmiCard}>
              <Text style={styles.bmiTitle}>BMI Calculator</Text>
              <View style={styles.bmiInputs}>
                <View style={styles.bmiField}>
                  <Text style={styles.bmiFieldLabel}>Weight (kg)</Text>
                  <View style={styles.bmiInput}>
                    <Text style={styles.bmiInputTxt}
                      onPress={() => Alert.prompt?.('Weight', 'Enter weight in kg', setWeight) ?? Alert.alert('Enter', 'Type in weight field')}>
                      {weight} kg
                    </Text>
                  </View>
                </View>
                <View style={styles.bmiField}>
                  <Text style={styles.bmiFieldLabel}>Height (cm)</Text>
                  <View style={styles.bmiInput}>
                    <Text style={styles.bmiInputTxt}>{height} cm</Text>
                  </View>
                </View>
              </View>
              {bmi && (
                <View style={styles.bmiResult}>
                  <Text style={styles.bmiVal}>{bmi}</Text>
                  <View style={[styles.bmiLabelPill, { backgroundColor: bmiColor }]}>
                    <Text style={styles.bmiLabelTxt}>{bmiLabel}</Text>
                  </View>
                </View>
              )}
            </LinearGradient>
          </View>
        )}

        {/* ── Daily Stats ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            {DAILY_STATS.map(s => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statTarget}>/ {s.target}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, { width: `${s.pct}%`, backgroundColor: s.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Water tracker ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Water Intake</Text>
            <Text style={styles.seeAll}>{water} / 8 glasses</Text>
          </View>
          <View style={styles.waterCard}>
            <View style={styles.glassRow}>
              {Array.from({ length: 8 }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setWater(i + 1)} style={styles.glassTap}>
                  <Text style={[styles.glassIcon, { opacity: i < water ? 1 : 0.3 }]}>💧</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.waterBarBg}>
              <LinearGradient
                colors={COLORS.gradAccent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.waterBarFill, { width: `${(water / 8) * 100}%` }]}
              />
            </View>
          </View>
        </View>

        {/* ── Weekly chart ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.card}>
            <View style={styles.weekRow}>
              {WEEKLY.map(w => (
                <View key={w.day} style={styles.weekCol}>
                  <View style={styles.weekBarWrap}>
                    <LinearGradient
                      colors={w.pct >= 80 ? COLORS.gradAccent : w.pct >= 50 ? COLORS.gradPrimary : [COLORS.border, COLORS.border]}
                      style={[styles.weekBar, { height: `${w.pct}%` }]}
                    />
                  </View>
                  <Text style={styles.weekDay}>{w.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Workouts ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workouts</Text>
            <Text style={styles.seeAll}>{doneCount}/{workouts.length} done</Text>
          </View>
          {workouts.map(w => (
            <TouchableOpacity
              key={w.id}
              style={[styles.workoutCard, w.done && styles.workoutCardDone]}
              onPress={() => toggleWorkout(w.id)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={w.done ? [COLORS.border, COLORS.border] : w.colors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.workoutIconBox}>
                <Text style={styles.workoutIcon}>{w.done ? '✅' : w.icon}</Text>
              </LinearGradient>
              <View style={styles.workoutInfo}>
                <Text style={[styles.workoutName, w.done && styles.workoutDoneText]}>{w.name}</Text>
                <Text style={styles.workoutMeta}>⏱ {w.duration}  ·  🔥 {w.calories} kcal  ·  {w.type}</Text>
              </View>
              <View style={[styles.workoutCheck, { backgroundColor: w.done ? COLORS.success : COLORS.border }]}>
                <Text style={styles.workoutCheckTxt}>{w.done ? '✓' : '○'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  px: { paddingHorizontal: SPACING.lg },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  pageTitle: { fontSize: FONT.h1, fontWeight: '700', color: COLORS.textPrimary },
  pageSub: { fontSize: FONT.sm, color: COLORS.textSecondary },
  bmiBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, ...SHADOW.sm },
  bmiBtnTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },

  bmiCard: { borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: 4, ...SHADOW.md },
  bmiTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textInverse, marginBottom: SPACING.lg },
  bmiInputs: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  bmiField: { flex: 1 },
  bmiFieldLabel: { fontSize: FONT.xs, color: 'rgba(255,255,255,0.8)', marginBottom: 6 },
  bmiInput: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.md, padding: SPACING.md },
  bmiInputTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.md },
  bmiResult: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  bmiVal: { fontSize: 48, fontWeight: '800', color: COLORS.textInverse },
  bmiLabelPill: { borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 6 },
  bmiLabelTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },

  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  seeAll: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '700' },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.sm },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  statCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
  statIcon: { fontSize: 26, marginBottom: 6 },
  statVal: { fontSize: FONT.xl, fontWeight: '800' },
  statTarget: { fontSize: FONT.xs, color: COLORS.textMuted },
  statLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: 4, marginBottom: 8 },
  statBarBg: { width: '100%', height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 3 },

  waterCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.sm },
  glassRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  glassTap: { padding: 4 },
  glassIcon: { fontSize: 26 },
  waterBarBg: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  waterBarFill: { height: '100%', borderRadius: 4 },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', height: 100, alignItems: 'flex-end' },
  weekCol: { alignItems: 'center', flex: 1 },
  weekBarWrap: { width: 14, height: 80, backgroundColor: COLORS.border, borderRadius: 7, overflow: 'hidden', justifyContent: 'flex-end' },
  weekBar: { width: '100%', borderRadius: 7 },
  weekDay: { fontSize: 9, color: COLORS.textMuted, marginTop: 4 },

  workoutCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, flexDirection: 'row', alignItems: 'center', ...SHADOW.sm },
  workoutCardDone: { opacity: 0.7 },
  workoutIconBox: { width: 46, height: 46, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  workoutIcon: { fontSize: 22 },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: FONT.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  workoutDoneText: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  workoutMeta: { fontSize: FONT.xs, color: COLORS.textSecondary },
  workoutCheck: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  workoutCheckTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },
});
