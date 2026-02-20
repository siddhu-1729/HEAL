import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const COLORS = {
  primary: "#2196F3",
  secondary: "#1976D2",
  accent: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFC107",
  background: "#F5F7FA",
  white: "#FFFFFF",
  text: "#333333",
  lightText: "#666666",
  border: "#E0E0E0",
};

const QUICK_ACTIONS = [
  {
    id: 1,
    title: "Schedule",
    subtitle: "Appointment",
    icon: "📅",
    color: ["#667eea", "#764ba2"],
  },
  {
    id: 2,
    title: "Medical",
    subtitle: "Records",
    icon: "📋",
    color: ["#f093fb", "#f5576c"],
  },
  {
    id: 3,
    title: "Messages",
    subtitle: "Doctor",
    icon: "💬",
    color: ["#4facfe", "#00f2fe"],
  },
  {
    id: 4,
    title: "Prescriptions",
    subtitle: "Active",
    icon: "💊",
    color: ["#43e97b", "#38f9d7"],
  },
];

const HEALTH_METRICS = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: "❤️" },
  { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: "📊" },
  { label: "Temperature", value: "98.6", unit: "°F", icon: "🌡️" },
];

const UPCOMING_APPOINTMENTS = [
  {
    id: 1,
    doctorName: "Dr. Emily Johnson",
    specialty: "Cardiologist",
    date: "Today",
    time: "2:30 PM",
  },
  {
    id: 2,
    doctorName: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: "Tomorrow",
    time: "10:00 AM",
  },
];

export default function HomeScreen({navigation}) {
  const [userName] = useState("Siddhu");

  const handleQuickAction = (actionId) => {
    console.log(`Navigating to action: ${actionId}`);
  };

  const renderQuickActionCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleQuickAction(item.id)}
      style={styles.actionCard}
    >
      <LinearGradient
        colors={item.color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionGradient}
      >
        <Text style={styles.actionIcon}>{item.icon}</Text>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMetricCard = ({ item }) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{item.icon}</Text>
      <Text style={styles.metricLabel}>{item.label}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{item.value}</Text>
        <Text style={styles.metricUnit}>{item.unit}</Text>
      </View>
    </View>
  );

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity style={styles.appointmentCard}>
      <View style={styles.appointmentLeft}>
        <View style={styles.appointmentDateBadge}>
          <Text style={styles.appointmentDateText}>
            {item.date === "Today" ? "T" : "T+1"}
          </Text>
        </View>
      </View>
      <View style={styles.appointmentContent}>
        <Text style={styles.appointmentDoctor}>{item.doctorName}</Text>
        <Text style={styles.appointmentSpecialty}>{item.specialty}</Text>
        <View style={styles.appointmentTime}>
          <Text style={styles.appointmentTimeText}>🕐 {item.time}</Text>
        </View>
      </View>
      <View style={styles.appointmentRight}>
        <Text style={styles.appointmentArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {userName} 👋</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>

          {/* Health Status Card */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusCard}
          >
            <View style={styles.statusContent}>
              <View>
                <Text style={styles.statusLabel}>Your Health Status</Text>
                <Text style={styles.statusValue}>Excellent 🎉</Text>
              </View>
              <TouchableOpacity style={styles.statusButton}>
                <Text style={styles.statusButtonText}>View Details →</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={QUICK_ACTIONS}
            renderItem={renderQuickActionCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.actionRow}
            scrollEnabled={false}
          />
        </View>

        {/* Health Metrics Section */}
        <View style={styles.section}> 
          <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('fitness')}>
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
            </View> 
          <FlatList
            data={HEALTH_METRICS}
            renderItem={renderMetricCard}
            keyExtractor={(item) => item.label}
            numColumns={3}
            columnWrapperStyle={styles.metricRow}
            scrollEnabled={false}
          />
        </View>

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText} >See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={UPCOMING_APPOINTMENTS}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Emergency Button */}
        <View style={styles.emergencySection}>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>Emergency Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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

  // Header styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 24,
  },

  // Status card
  statusCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  statusContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  statusButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },

  // Section styles
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
  seeAllText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Quick action styles
  actionRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionCard: {
    width: "48%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },

  // Metric card styles
  metricRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricCard: {
    width: "31%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.lightText,
    textAlign: "center",
    marginBottom: 6,
  },
  metricValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  metricUnit: {
    fontSize: 10,
    color: COLORS.lightText,
    marginLeft: 2,
  },

  // Appointment styles
  appointmentCard: {
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
  appointmentLeft: {
    marginRight: 12,
  },
  appointmentDateBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentDateText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentDoctor: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  appointmentSpecialty: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 6,
  },
  appointmentTime: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  appointmentTimeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
  },
  appointmentRight: {
    marginLeft: 12,
  },
  appointmentArrow: {
    fontSize: 18,
    color: COLORS.lightText,
  },

  // Emergency section
  emergencySection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },

  // Bottom padding
  bottomPadding: {
    height: 20,
  },
});

