import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, FlatList, Alert, Modal, TextInput,
  Animated, Dimensions, Easing
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { useAppTheme, useFitness } from '../context/AppContext';

const getDailyStats = (s) => [
  { label: s.steps, value: '7,240', target: '10,000', icon: '👟', pct: 72, color: COLORS.primary },
  { label: s.calories, value: '1,840', target: '2,200', icon: '🔥', pct: 84, color: COLORS.danger },
  { label: s.water, value: '6', target: '8', icon: '💧', pct: 75, color: '#00C6AE' },
  { label: s.sleep, value: '7.2h', target: '8h', icon: '🌙', pct: 90, color: COLORS.gradPurple[0] },
];
const getPresetActivities = (s) => [
  { name: s.actRunning, key: 'Running' },
  { name: s.actWalking, key: 'Walking' },
  { name: s.actCycling, key: 'Cycling' },
  { name: s.actSwimming, key: 'Swimming' },
  { name: s.actPushup, key: 'Push-Up Circuit' },
  { name: s.actWeightLifting, key: 'Weight Lifting' },
  { name: s.actYoga, key: 'Yoga & Stretch' },
  { name: s.actMeditation, key: 'Meditation' },
  { name: s.actHIIT, key: 'HIIT' },
  { name: s.actSports, key: 'Sports / Other' }
];

const WEEKLY = [
  { day: 'Mon', pct: 95 }, { day: 'Tue', pct: 60 }, { day: 'Wed', pct: 80 },
  { day: 'Thu', pct: 100 }, { day: 'Fri', pct: 45 }, { day: 'Sat', pct: 70 }, { day: 'Sun', pct: 30 },
];

const getVideoSource = (item) => {
  const VIDEO_NAMES = {
    'Running': 'https://videos.pexels.com/video-files/5310962/5310962-uhd_1440_2560_25fps.mp4',
    'Morning Run': 'https://videos.pexels.com/video-files/5310962/5310962-uhd_1440_2560_25fps.mp4', // fallback for default id:1
    'Walking': 'https://videos.pexels.com/video-files/8045821/8045821-hd_1080_1920_25fps.mp4',
    'Cycling': 'https://videos.pexels.com/video-files/5790075/5790075-hd_1920_1080_30fps.mp4',
    'Swimming': 'https://videos.pexels.com/video-files/992714/992714-hd_1920_1080_25fps.mp4',
    'Push-Up Circuit': 'https://videos.pexels.com/video-files/4754030/4754030-uhd_2732_1440_25fps.mp4',
    'Weight Lifting': 'https://videos.pexels.com/video-files/4754030/4754030-uhd_2732_1440_25fps.mp4', // reuse strength
    'Yoga & Stretch': 'https://videos.pexels.com/video-files/3760968/3760968-uhd_2560_1440_25fps.mp4',
    'Meditation': 'https://videos.pexels.com/video-files/3209148/3209148-uhd_3840_2160_25fps.mp4',
    'HIIT': 'https://videos.pexels.com/video-files/6389060/6389060-hd_1080_1920_25fps.mp4',
    'Sports / Other': 'https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_24fps.mp4'
  };

  const uri = VIDEO_NAMES[item.name] || VIDEO_NAMES['Running']; // Default fallback if custom name used
  return { uri };
};

export default function FitnessScreen({ navigation }) {
  const { strings } = useAppTheme();
  const { workouts, setWorkouts, activeSessionIndex, setActiveSessionIndex } = useFitness();
  const DAILY_STATS = getDailyStats(strings);
  const PRESET_ACTIVITIES = getPresetActivities(strings);

  const [water, setWater] = useState(6);
  const [showBMI, setShowBMI] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingThreshold, setEditingThreshold] = useState('');
  const [showThresholdModal, setShowThresholdModal] = useState(false);


  const flatListRef = useRef(null);
  const breathAnim = useRef(new Animated.Value(1)).current;

  // Animation loop
  useEffect(() => {
    if (activeSessionIndex !== null) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, { toValue: 1.15, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(breathAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ])
      ).start();
    } else {
      breathAnim.stopAnimation();
      breathAnim.setValue(1);
    }
  }, [activeSessionIndex]);



  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeSessionIndex) {
      setActiveSessionIndex(index);
    }
  };

  const toggleTimer = (id) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isActive: !w.isActive };
      }
      return { ...w, isActive: false };
    }));
  };

  const stopWorkout = (id) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, isActive: false } : w));
  };

  const resetWorkout = (id) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, elapsed: 0, isActive: false } : w));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addActivity = () => {
    if (!activityName.trim() || !activityDuration.trim()) {
      Alert.alert(strings.errorTitle, strings.errorEmptyFields);
      return;
    }
    const newActivity = {
      id: Date.now().toString(),
      name: activityName,
      keyName: PRESET_ACTIVITIES.find(a => a.name === activityName)?.key || activityName,
      duration: `${activityDuration} ${strings.minutes.replace(':', '')}`,
      calories: Math.floor(Math.random() * 300 + 100),
      icon: '🏋️',
      done: false,
      colors: COLORS.gradPrimary,
      threshold: parseInt(activityDuration),
      elapsed: 0,
      isActive: false,
    };
    setWorkouts([...workouts, newActivity]);
    setActivityName('');
    setActivityDuration('');
    setShowAddActivity(false);
  };

  const updateThreshold = (id) => {
    if (!editingThreshold.trim()) {
      Alert.alert('Error', 'Please enter a threshold value');
      return;
    }
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, threshold: parseInt(editingThreshold), elapsed: 0 } : w));
    setEditingThreshold('');
    setEditingId(null);
    setShowThresholdModal(false);
  };

  const deleteActivity = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const doneCount = workouts.filter(w => w.done).length;

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;
  const bmiLabel = bmi < 18.5 ? strings.underweight : bmi < 25 ? strings.normal : bmi < 30 ? strings.overweight : strings.obese;
  const bmiColor = bmi < 18.5 ? COLORS.info : bmi < 25 ? COLORS.success : bmi < 30 ? COLORS.warning : COLORS.danger;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.pageTitle}>{strings.fitness}</Text>
            <Text style={styles.pageSub}>{strings.workoutTimer}</Text>
          </View>
          <TouchableOpacity
            style={styles.bmiBtn}
            onPress={() => setShowBMI(s => !s)}
          >
            <Text style={styles.bmiBtnTxt}>⚖️ {strings.bmi}</Text>
          </TouchableOpacity>
        </View>

        {/* ── BMI Calculator ── */}
        {showBMI && (
          <View style={styles.px}>
            <LinearGradient colors={COLORS.gradPrimary} style={styles.bmiCard}>
              <Text style={styles.bmiTitle}>{strings.bmiCalc}</Text>
              <View style={styles.bmiInputs}>
                <View style={styles.bmiField}>
                  <Text style={styles.bmiFieldLabel}>{strings.weightKg}</Text>
                  <View style={styles.bmiInput}>
                    <TextInput
                      style={styles.bmiInputTxt}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="-"
                      placeholderTextColor={COLORS.textInverse}
                      textAlign="center"
                    />
                  </View>
                </View>
                <View style={styles.bmiField}>
                  <Text style={styles.bmiFieldLabel}>{strings.heightCm}</Text>
                  <View style={styles.bmiInput}>
                    <TextInput
                      style={styles.bmiInputTxt}
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="numeric"
                      placeholder="-"
                      placeholderTextColor={COLORS.textInverse}
                      textAlign="center"
                    />
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
          <Text style={styles.sectionTitle}>{strings.todaysStats}</Text>
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
            <Text style={styles.sectionTitle}>{strings.waterIntake}</Text>
            <Text style={styles.seeAll}>{water} / 8 {strings.glasses}</Text>
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

        {/* ── Fitness Activities with Timer ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{strings.fitnessActivities}</Text>
            <TouchableOpacity
              onPress={() => setShowAddActivity(true)}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnTxt}>{strings.addBtn}</Text>
            </TouchableOpacity>
          </View>

          {workouts.map(w => {
            const progress = w.threshold > 0 ? (w.elapsed / (w.threshold * 60)) * 100 : 0;
            const isCompleted = w.elapsed >= w.threshold * 60;

            return (
              <View key={w.id} style={styles.activityCard}>
                <View style={styles.activityCardTop}>
                  <LinearGradient colors={w.done ? [COLORS.border, COLORS.border] : w.colors}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.activityIconBox}>
                    <Text style={styles.activityIcon}>{w.done ? '✅' : w.icon}</Text>
                  </LinearGradient>

                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityName, w.done && styles.activityDoneText]}>
                      {PRESET_ACTIVITIES.find(a => a.key === w.keyName)?.name || w.name}
                    </Text>
                    <Text style={styles.activityMeta}>{w.calories} {strings.kcal}</Text>

                    {/* Timer Display */}
                    <View style={styles.timerSection}>
                      <Text style={styles.timerLabel}>{strings.timeLabel} <Text style={[styles.timerValue, isCompleted && styles.timerCompleted]}>{formatTime(w.elapsed)}</Text> / {w.threshold}:00</Text>
                      {isCompleted && <Text style={styles.completedBadge}>{strings.completed}</Text>}
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBg}>
                      <LinearGradient
                        colors={progress >= 100 ? [COLORS.success, COLORS.success] : w.colors}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]}
                      />
                    </View>
                  </View>
                </View>

                {/* Timer Controls */}
                <View style={styles.timerControls}>
                  <TouchableOpacity
                    style={[
                      styles.startSessionBtn,
                      { backgroundColor: w.isActive ? COLORS.success : COLORS.primary }
                    ]}
                    disabled={w.isActive}
                    onPress={() => {
                      if (!weight || !height) {
                        setShowBMI(true);
                        Alert.alert(strings.bmiReqTitle, strings.bmiReqMsg);
                        return;
                      }

                      const idx = workouts.findIndex(x => x.id === w.id);
                      setActiveSessionIndex(idx);
                      // Force this session active and pause all others
                      setWorkouts(prev => prev.map(workout => ({
                        ...workout,
                        isActive: workout.id === w.id,
                      })));
                    }}
                  >
                    <Text style={[styles.timerBtnTxt, { color: COLORS.textInverse, fontWeight: '700' }]}>
                      {w.isActive ? strings.activityStarted : strings.startSession}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.timerBtn}
                    onPress={() => resetWorkout(w.id)}
                  >
                    <Text style={styles.timerBtnTxt}>🔄</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.timerBtn}
                    onPress={() => {
                      setEditingId(w.id);
                      setEditingThreshold(w.threshold.toString());
                      setShowThresholdModal(true);
                    }}
                  >
                    <Text style={styles.timerBtnTxt}>⚙️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.timerBtn, styles.deleteBtnColor]}
                    onPress={() => Alert.alert(strings.deleteAccount ? strings.deleteAccount.split(' ')[0] : 'Delete', strings.removeActivity, [
                      { text: strings.cancel, onPress: () => { } },
                      { text: strings.deleteAccount ? strings.deleteAccount.split(' ')[0] : 'Delete', onPress: () => deleteActivity(w.id), style: 'destructive' }
                    ])}
                  >
                    <Text style={styles.timerBtnTxt}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* ── Add Activity Modal ── */}
      <Modal visible={showAddActivity} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{strings.addNewActivity}</Text>
              <TouchableOpacity onPress={() => setShowAddActivity(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>{strings.activityName}</Text>
              <TouchableOpacity
                style={[styles.modalInput, { justifyContent: 'center' }]}
                onPress={() => setShowActivityDropdown(!showActivityDropdown)}
              >
                <Text style={{ color: activityName ? COLORS.textPrimary : COLORS.textMuted }}>
                  {activityName || strings.selectActivity}
                </Text>
              </TouchableOpacity>

              {showActivityDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                    {PRESET_ACTIVITIES.filter(act => !workouts.some(w => w.name === act.name || w.keyName === act.name)).map(act => (
                      <TouchableOpacity
                        key={act.key}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setActivityName(act.name);
                          setShowActivityDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{act.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.modalLabel}>{strings.durationMin}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={strings.eg30}
                placeholderTextColor={COLORS.textMuted}
                value={activityDuration}
                onChangeText={setActivityDuration}
                keyboardType="number-pad"
              />

            </View>

            <TouchableOpacity style={styles.addActivityBtn} onPress={addActivity}>
              <Text style={styles.addActivityBtnTxt}>{strings.addActivityBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Active Workout Session Modal ── */}
      <Modal visible={activeSessionIndex !== null} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
          <TouchableOpacity style={styles.closeSessionBtn} onPress={() => setActiveSessionIndex(null)}>
            <Text style={styles.closeSessionTxt}>{strings.closeSession}</Text>
          </TouchableOpacity>

          <FlatList
            ref={flatListRef}
            data={workouts}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            onScrollToIndexFailed={info => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              }, 500);
            }}
            getItemLayout={(data, index) => ({ length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index })}
            initialScrollIndex={activeSessionIndex || 0}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              const isActive = index === activeSessionIndex;
              const progressPct = item.threshold > 0 ? Math.min((item.elapsed / (item.threshold * 60)) * 100, 100) : 0;

              return (
                <View style={[styles.sessionSlide, { width: Dimensions.get('window').width }]}>
                  <Text style={styles.sessionTitle}>
                    {PRESET_ACTIVITIES.find(a => a.key === item.keyName)?.name || item.name}
                  </Text>

                  <Animated.View style={[styles.sessionIconWrap, isActive && { transform: [{ scale: breathAnim }] }]}>
                    <LinearGradient colors={item.done ? [COLORS.success, COLORS.successLight] : item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sessionIconBoxModal}>
                      {item.done ? (
                        <Text style={styles.sessionIconModal}>✅</Text>
                      ) : (
                        <View style={{ width: 132, height: 132, borderRadius: 66, overflow: 'hidden' }}>
                          <Video
                            source={getVideoSource(item)}
                            style={{ flex: 1 }}
                            repeat={true}
                            resizeMode="cover"
                            paused={!isActive}
                            muted={true}
                          />
                        </View>
                      )}
                    </LinearGradient>
                  </Animated.View>

                  <Text style={styles.sessionTime}>{formatTime(item.elapsed)}</Text>
                  <Text style={styles.sessionTarget}>{strings.target} {item.threshold}:00</Text>

                  <View style={styles.sessionProgressBg}>
                    <LinearGradient
                      colors={item.done ? [COLORS.success, COLORS.success] : item.colors}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[styles.sessionProgressFill, { width: `${progressPct}%` }]}
                    />
                  </View>

                  {item.done && <Text style={styles.sessionDoneBadge}>{strings.workoutCompleted}</Text>}

                  {!item.done && (
                    <Text style={styles.sessionSwipeHint}>{strings.swipeToBrowse}</Text>
                  )}
                </View>
              );
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* ── Threshold Modal ── */}
      <Modal visible={showThresholdModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
            <Text style={styles.modalTitle}>{strings.setTimeThreshold}</Text>
            <Text style={styles.thresholdLabel}>{strings.minutes}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={strings.enterMinutes}
              placeholderTextColor={COLORS.textMuted}
              value={editingThreshold}
              onChangeText={setEditingThreshold}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setShowThresholdModal(false);
                  setEditingId(null);
                  setEditingThreshold('');
                }}
              >
                <Text style={styles.modalBtnTxt}>{strings.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={() => updateThreshold(editingId)}
              >
                <Text style={[styles.modalBtnTxt, { color: COLORS.textInverse }]}>{strings.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
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
  bmiInputTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.lg, padding: 0 },
  bmiResult: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  bmiVal: { fontSize: 48, fontWeight: '800', color: COLORS.textInverse },
  bmiLabelPill: { borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 6 },
  bmiLabelTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },

  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  seeAll: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '700' },
  addBtn: { backgroundColor: COLORS.success, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  addBtnTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.sm },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
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

  // Activity Timer Styles
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'column',
    ...SHADOW.sm,
  },
  activityCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  activityIconBox: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityIcon: { fontSize: 24 },
  activityInfo: { flex: 1, marginRight: SPACING.sm },
  activityName: { fontSize: FONT.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  activityDoneText: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  activityMeta: { fontSize: FONT.xs, color: COLORS.textSecondary, marginBottom: 6 },

  timerSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  timerLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, fontWeight: '600' },
  timerValue: { color: COLORS.primary, fontWeight: '800' },
  timerCompleted: { color: COLORS.success },
  completedBadge: { fontSize: FONT.xs, color: COLORS.success, fontWeight: '700' },

  progressBarBg: { width: '100%', height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  timerControls: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
  startSessionBtn: {
    flex: 1,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.xs,
  },

  // Active Workout Session Modal Styles
  closeSessionBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full },
  closeSessionTxt: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.textPrimary },
  sessionSlide: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  sessionType: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: SPACING.sm },
  sessionName: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.xxxl, textAlign: 'center' },
  sessionIconWrap: { marginBottom: SPACING.xxxl },
  sessionIconBoxModal: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', ...SHADOW.lg },
  sessionIconModal: { fontSize: 60 },
  sessionTime: { fontSize: 64, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm, fontVariant: ['tabular-nums'] },
  sessionTarget: { fontSize: FONT.lg, color: COLORS.textSecondary, marginBottom: SPACING.xxl },
  sessionProgressBg: { width: '80%', height: 12, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden', marginBottom: SPACING.xl },
  sessionProgressFill: { height: '100%', borderRadius: 6 },
  sessionDoneBadge: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.success, marginTop: SPACING.lg },
  sessionSwipeHint: { fontSize: FONT.sm, color: COLORS.textMuted, marginTop: SPACING.xxl, fontStyle: 'italic' },
  timerBtnActive: { backgroundColor: COLORS.success },
  timerBtnTxt: { fontSize: FONT.lg, color: COLORS.textPrimary },
  deleteBtnColor: { backgroundColor: COLORS.danger },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalContentSmall: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    ...SHADOW.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary },
  modalClose: { fontSize: FONT.lg, color: COLORS.textSecondary, fontWeight: '700' },
  modalBody: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  modalLabel: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  modalInput: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    fontSize: FONT.base,
  },
  thresholdLabel: {
    fontSize: FONT.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  addActivityBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.md },
  addActivityBtnTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.md },

  dropdownContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    marginTop: -8, // pull it up slightly closer to input
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    color: COLORS.textPrimary,
    fontSize: FONT.sm,
  },
  modalButtonRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  modalBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: 'center' },
  cancelBtn: { backgroundColor: COLORS.border },
  confirmBtn: { backgroundColor: COLORS.primary },
  modalBtnTxt: { color: COLORS.textPrimary, fontWeight: '700', fontSize: FONT.base },
});
