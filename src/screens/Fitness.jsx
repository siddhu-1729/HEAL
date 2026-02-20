import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const COLORS = {
  primary: "#2196F3",
  secondary: "#1976D2",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",
  info: "#00BCD4",
  background: "#F5F7FA",
  white: "#FFFFFF",
  text: "#333333",
  lightText: "#666666",
  border: "#E0E0E0",
};

const ACTIVITY_TYPES = [
  { id: 1, name: "Walking", icon: "🚶", color: ["#667eea", "#764ba2"] },
  { id: 2, name: "Running", icon: "🏃", color: ["#f093fb", "#f5576c"] },
  { id: 3, name: "Cycling", icon: "🚴", color: ["#4facfe", "#00f2fe"] },
  { id: 4, name: "Swimming", icon: "🏊", color: ["#43e97b", "#38f9d7"] },
  { id: 5, name: "Yoga", icon: "🧘", color: ["#fa709a", "#fee140"] },
  { id: 6, name: "Gym", icon: "🏋️", color: ["#30cfd0", "#330867"] },
  { id: 7, name: "Basketball", icon: "🏀", color: ["#a8edea", "#fed6e3"] },
  { id: 8, name: "Tennis", icon: "🎾", color: ["#ff9a56", "#ff6a88"] },
];

const DAILY_METRICS = [
  { id: 1, label: "Steps", value: "8,432", goal: "10,000", icon: "👣" },
  { id: 2, label: "Calories", value: "456", goal: "600", icon: "🔥" },
  { id: 3, label: "Distance", value: "5.2", goal: "8", icon: "📏", unit: "km" },
  { id: 4, label: "Heart Rate", value: "72", goal: "Avg", icon: "❤️", unit: "bpm" },
];

const SLEEP_DATA = [
  { id: 1, date: "Today", hours: 7.5, quality: "Good", icon: "😴" },
  { id: 2, date: "Yesterday", hours: 6.8, quality: "Fair", icon: "😴" },
  { id: 3, date: "Feb 18", hours: 8.2, quality: "Excellent", icon: "😴" },
];

const WATER_INTAKE = [
  { id: 1, time: "8:00 AM", cups: 2, icon: "💧" },
  { id: 2, time: "12:00 PM", cups: 3, icon: "💧" },
  { id: 3, time: "3:00 PM", cups: 2, icon: "💧" },
  { id: 4, time: "6:00 PM", cups: 1, icon: "💧" },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    name: "Morning Run",
    duration: 30,
    distance: 5,
    calories: 350,
    date: "Today, 6:30 AM",
    icon: "🏃",
  },
  {
    id: 2,
    name: "Gym Workout",
    duration: 60,
    distance: 0,
    calories: 450,
    date: "Today, 5:00 PM",
    icon: "🏋️",
  },
  {
    id: 3,
    name: "Evening Walk",
    duration: 20,
    distance: 2,
    calories: 120,
    date: "Yesterday, 7:00 PM",
    icon: "🚶",
  },
  {
    id: 4,
    name: "Yoga Session",
    duration: 45,
    distance: 0,
    calories: 180,
    date: "Yesterday, 10:00 AM",
    icon: "🧘",
  },
];

export default function FitnessScreen() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    duration: "",
    distance: "",
    calories: "",
  });
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);
  const [waterCups, setWaterCups] = useState(WATER_INTAKE.length);

  const handleAddActivity = () => {
    if (!selectedActivity || !formData.duration) {
      Alert.alert("Error", "Please select activity and duration");
      return;
    }

    const newActivity = {
      id: activities.length + 1,
      name: ACTIVITY_TYPES.find((a) => a.id === selectedActivity)?.name,
      icon: ACTIVITY_TYPES.find((a) => a.id === selectedActivity)?.icon,
      duration: parseInt(formData.duration),
      distance: parseInt(formData.distance) || 0,
      calories: parseInt(formData.calories) || 0,
      date: new Date().toLocaleString(),
    };

    setActivities([newActivity, ...activities]);
    setModalVisible(false);
    setFormData({ duration: "", distance: "", calories: "" });
    setSelectedActivity(null);
    Alert.alert("Success", "Activity logged successfully!");
  };

  const handleAddWater = () => {
    setWaterCups(waterCups + 1);
  };

  const renderActivityTypeCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedActivity(item.id)}
      style={[
        styles.activityTypeCard,
        selectedActivity === item.id && styles.activityTypeCardSelected,
      ]}
    >
      <LinearGradient
        colors={item.color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activityTypeGradient}
      >
        <Text style={styles.activityTypeIcon}>{item.icon}</Text>
        <Text style={styles.activityTypeName}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMetricCard = ({ item }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricTop}>
        <Text style={styles.metricIcon}>{item.icon}</Text>
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>
      <Text style={styles.metricValue}>{item.value}</Text>
      <View style={styles.metricProgress}>
        <View
          style={[
            styles.metricProgressBar,
            {
              width: `${
                (parseInt(item.value.replace(/,/g, "")) /
                  parseInt(item.goal.replace(/,/g, ""))) *
                100
              }%`,
            },
          ]}
        />
      </View>
      <View style={styles.metricGoal}>
        <Text style={styles.metricGoalText}>Goal: {item.goal}</Text>
        {item.unit && <Text style={styles.metricUnit}>{item.unit}</Text>}
      </View>
    </View>
  );

  const renderSleepCard = ({ item }) => (
    <View style={styles.sleepCard}>
      <View style={styles.sleepLeft}>
        <Text style={styles.sleepIcon}>{item.icon}</Text>
      </View>
      <View style={styles.sleepContent}>
        <Text style={styles.sleepDate}>{item.date}</Text>
        <Text style={styles.sleepHours}>{item.hours} hours</Text>
        <Text style={styles.sleepQuality}>{item.quality} quality</Text>
      </View>
      <View
        style={[
          styles.sleepBadge,
          {
            backgroundColor:
              item.quality === "Excellent"
                ? COLORS.success
                : item.quality === "Good"
                ? COLORS.info
                : COLORS.warning,
          },
        ]}
      >
        <Text style={styles.sleepBadgeText}>
          {item.quality === "Excellent" ? "⭐" : "✓"}
        </Text>
      </View>
    </View>
  );

  const renderActivityCard = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityCardIcon}>{item.icon}</Text>
      </View>
      <View style={styles.activityBody}>
        <Text style={styles.activityName}>{item.name}</Text>
        <Text style={styles.activityDate}>{item.date}</Text>
        <View style={styles.activityDetails}>
          <View style={styles.activityDetail}>
            <Text style={styles.activityDetailIcon}>⏱️</Text>
            <Text style={styles.activityDetailText}>{item.duration} min</Text>
          </View>
          {item.distance > 0 && (
            <View style={styles.activityDetail}>
              <Text style={styles.activityDetailIcon}>📏</Text>
              <Text style={styles.activityDetailText}>{item.distance} km</Text>
            </View>
          )}
          <View style={styles.activityDetail}>
            <Text style={styles.activityDetailIcon}>🔥</Text>
            <Text style={styles.activityDetailText}>{item.calories} cal</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Fitness Tracker</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Daily Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <FlatList
            data={DAILY_METRICS}
            renderItem={renderMetricCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.metricRow}
            scrollEnabled={false}
          />
        </View>

        {/* Water Intake Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Water Intake</Text>
            <Text style={styles.waterCount}>{waterCups} cups</Text>
          </View>
          <View style={styles.waterContainer}>
            <View style={styles.waterProgress}>
              <View
                style={[
                  styles.waterProgressBar,
                  { width: `${(waterCups / 8) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.addWaterButton}
              onPress={handleAddWater}
            >
              <Text style={styles.addWaterText}>+ Add Water</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.waterLog}>
            <FlatList
              data={WATER_INTAKE.slice(0, waterCups)}
              renderItem={({ item }) => (
                <View style={styles.waterItem}>
                  <Text style={styles.waterIcon}>{item.icon}</Text>
                  <View style={styles.waterItemContent}>
                    <Text style={styles.waterTime}>{item.time}</Text>
                    <Text style={styles.waterCupsText}>
                      {item.cups} cups consumed
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Sleep Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Tracking</Text>
          <FlatList
            data={SLEEP_DATA}
            renderItem={renderSleepCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Log Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log Activity</Text>
          <TouchableOpacity
            style={styles.logActivityButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.logActivityIcon}>➕</Text>
            <View>
              <Text style={styles.logActivityTitle}>Add New Activity</Text>
              <Text style={styles.logActivitySubtitle}>
                Track your fitness
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <FlatList
            data={activities.slice(0, 5)}
            renderItem={renderActivityCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Activity Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Activity</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Select Activity Type */}
              <Text style={styles.modalSectionTitle}>Select Activity</Text>
              <FlatList
                data={ACTIVITY_TYPES}
                renderItem={renderActivityTypeCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                columnWrapperStyle={styles.activityTypeRow}
                scrollEnabled={false}
              />

              {/* Duration Input */}
              <Text style={styles.inputLabel}>Duration (minutes) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter duration"
                placeholderTextColor={COLORS.lightText}
                keyboardType="numeric"
                value={formData.duration}
                onChangeText={(text) =>
                  setFormData({ ...formData, duration: text })
                }
              />

              {/* Distance Input */}
              <Text style={styles.inputLabel}>Distance (km)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter distance (optional)"
                placeholderTextColor={COLORS.lightText}
                keyboardType="decimal-pad"
                value={formData.distance}
                onChangeText={(text) =>
                  setFormData({ ...formData, distance: text })
                }
              />

              {/* Calories Input */}
              <Text style={styles.inputLabel}>Calories Burned</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter calories (optional)"
                placeholderTextColor={COLORS.lightText}
                keyboardType="numeric"
                value={formData.calories}
                onChangeText={(text) =>
                  setFormData({ ...formData, calories: text })
                }
              />

              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleAddActivity}
                >
                  <Text style={styles.modalSaveText}>Save Activity</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

  // Metric Card
  metricRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  metricProgress: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  metricProgressBar: {
    height: "100%",
    backgroundColor: COLORS.success,
  },
  metricGoal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricGoalText: {
    fontSize: 11,
    color: COLORS.lightText,
  },
  metricUnit: {
    fontSize: 11,
    color: COLORS.lightText,
  },

  // Water Intake
  waterCount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  waterContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  waterProgress: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  waterProgressBar: {
    height: "100%",
    backgroundColor: COLORS.info,
  },
  addWaterButton: {
    backgroundColor: COLORS.info,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addWaterText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  waterLog: {
    marginTop: 12,
  },
  waterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  waterIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  waterItemContent: {
    flex: 1,
  },
  waterTime: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 2,
  },
  waterCupsText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  // Sleep Card
  sleepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sleepLeft: {
    marginRight: 12,
  },
  sleepIcon: {
    fontSize: 28,
  },
  sleepContent: {
    flex: 1,
  },
  sleepDate: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 2,
  },
  sleepHours: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  sleepQuality: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  sleepBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sleepBadgeText: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Log Activity Button
  logActivityButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logActivityIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  logActivityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  logActivitySubtitle: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },

  // Activity Card
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityCardIcon: {
    fontSize: 28,
  },
  activityBody: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  activityDate: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
    marginBottom: 8,
  },
  activityDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  activityDetailIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  activityDetailText: {
    fontSize: 11,
    color: COLORS.lightText,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseIcon: {
    fontSize: 18,
    color: COLORS.text,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

  // Activity Type Selection
  activityTypeRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  activityTypeCard: {
    width: "23%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activityTypeCardSelected: {
    borderColor: COLORS.primary,
  },
  activityTypeGradient: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTypeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  activityTypeName: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
  },

  // Form Inputs
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },

  // Modal Buttons
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },

  // Bottom Padding
  bottomPadding: {
    height: 20,
  },
});
