import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, FlatList, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const NOTIFICATIONS = [
    {
        id: '1', type: 'critical', icon: '🚨', title: 'High Risk Alert',
        body: 'Your brain scan shows a high probability of abnormality. Book a consultation immediately.',
        time: '2 min ago', read: false, action: 'Book Now',
    },
    {
        id: '2', type: 'medicine', icon: '💊', title: 'Medicine Reminder',
        body: 'Time to take Metformin 500mg — after your meal.',
        time: '45 min ago', read: false, action: 'Mark Done',
    },
    {
        id: '3', type: 'workout', icon: '🏃', title: 'Workout Reminder',
        body: 'Your daily 30-minute cardio session is scheduled. Stay on track!',
        time: '2 hrs ago', read: true, action: 'Start',
    },
    {
        id: '4', type: 'tip', icon: '💡', title: 'Health Tip',
        body: 'Drink at least 8 glasses of water today. Hydration improves brain function by up to 14%.',
        time: '4 hrs ago', read: true, action: null,
    },
    {
        id: '5', type: 'appointment', icon: '📅', title: 'Appointment Tomorrow',
        body: 'Dr. Emily Johnson (Cardiologist) — Tomorrow at 2:30 PM. Don\'t forget to bring your reports.',
        time: '6 hrs ago', read: true, action: 'View Details',
    },
    {
        id: '6', type: 'medicine', icon: '💊', title: 'Missed Dose Warning',
        body: 'You missed your Atorvastatin 10mg dose last night. Take it as soon as possible.',
        time: 'Yesterday', read: true, action: 'Log Dose',
    },
    {
        id: '7', type: 'tip', icon: '🌙', title: 'Sleep Reminder',
        body: 'You\'ve been active for 16 hours. Aim for 7–8 hours of sleep tonight for optimal recovery.',
        time: 'Yesterday', read: true, action: null,
    },
    {
        id: '8', type: 'workout', icon: '⭐', title: 'Weekly Goal Achieved!',
        body: 'Amazing! You completed your workout 5 days this week. Keep up the great work!',
        time: '2 days ago', read: true, action: null,
    },
];

const TYPE_CONFIG = {
    critical: { colors: COLORS.gradDanger, bg: COLORS.dangerLight, text: '#7F1D1D' },
    medicine: { colors: COLORS.gradPrimary, bg: COLORS.primaryLight, text: COLORS.primary },
    workout: { colors: COLORS.gradAccent, bg: COLORS.accentLight, text: COLORS.accentDark },
    tip: { colors: COLORS.gradSuccess, bg: COLORS.successLight, text: '#14532D' },
    appointment: { colors: COLORS.gradPurple, bg: '#EDE9FE', text: '#5B21B6' },
};

const FILTERS = ['All', 'Unread', 'Medicine', 'Workout', 'Tips'];

export default function NotificationPanelScreen({ navigation }) {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [filter, setFilter] = useState('All');

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

    const filtered = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Unread') return !n.read;
        if (filter === 'Medicine') return n.type === 'medicine';
        if (filter === 'Workout') return n.type === 'workout';
        if (filter === 'Tips') return n.type === 'tip';
        return true;
    });

    const renderItem = ({ item }) => {
        const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.tip;
        return (
            <TouchableOpacity
                style={[styles.notifCard, !item.read && styles.notifCardUnread]}
                onPress={() => markRead(item.id)}
                activeOpacity={0.85}
            >
                {/* Unread dot */}
                {!item.read && <View style={styles.unreadDot} />}

                <View style={styles.notifRow}>
                    {/* Icon */}
                    <LinearGradient colors={cfg.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.notifIconBox}>
                        <Text style={styles.notifIcon}>{item.icon}</Text>
                    </LinearGradient>

                    {/* Content */}
                    <View style={styles.notifContent}>
                        <View style={styles.notifTitleRow}>
                            <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.notifTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>

                        {/* Action + Dismiss */}
                        <View style={styles.notifActions}>
                            {item.action && (
                                <TouchableOpacity
                                    style={[styles.actionChip, { backgroundColor: cfg.bg }]}
                                    onPress={() => { markRead(item.id); Alert.alert(item.action, 'Coming soon!'); }}
                                >
                                    <Text style={[styles.actionChipTxt, { color: cfg.text }]}>{item.action}</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.dismissBtn} onPress={() => dismiss(item.id)}>
                                <Text style={styles.dismissTxt}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>

                {/* Header */}
                <LinearGradient colors={COLORS.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIconWrap}>
                        <Text style={styles.headerMainIcon}>🔔</Text>
                    </View>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <Text style={styles.headerSub}>
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </Text>
                </LinearGradient>

                {/* Mark all read */}
                {unreadCount > 0 && (
                    <TouchableOpacity style={styles.markAllRow} onPress={markAllRead}>
                        <Text style={styles.markAllTxt}>✓  Mark all as read</Text>
                    </TouchableOpacity>
                )}

                {/* Filter chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}
                    contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}>
                    {FILTERS.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterTxt, filter === f && styles.filterTxtActive]}>{f}</Text>
                            {f === 'Unread' && unreadCount > 0 && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeTxt}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Notifications list */}
                <View style={styles.section}>
                    {filtered.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyIcon}>🎉</Text>
                            <Text style={styles.emptyTitle}>All clear!</Text>
                            <Text style={styles.emptyTxt}>No notifications in this category</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filtered}
                            renderItem={renderItem}
                            keyExtractor={i => i.id}
                            scrollEnabled={false}
                        />
                    )}
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
    headerSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.85)' },

    markAllRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
    markAllTxt: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '700' },

    filterScroll: { marginTop: SPACING.md },
    filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterTxt: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
    filterTxtActive: { color: COLORS.textInverse },
    filterBadge: { marginLeft: 5, backgroundColor: COLORS.danger, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
    filterBadgeTxt: { color: COLORS.textInverse, fontSize: 10, fontWeight: '800' },

    notifCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, marginBottom: SPACING.md, padding: SPACING.md, ...SHADOW.sm, position: 'relative' },
    notifCardUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary, backgroundColor: '#FAFCFF' },
    unreadDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
    notifRow: { flexDirection: 'row', alignItems: 'flex-start' },
    notifIconBox: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    notifIcon: { fontSize: 20 },
    notifContent: { flex: 1 },
    notifTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    notifTitle: { fontSize: FONT.base, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
    notifTime: { fontSize: FONT.xs, color: COLORS.textMuted, marginLeft: SPACING.sm },
    notifBody: { fontSize: FONT.sm, color: COLORS.textSecondary, lineHeight: 19, marginBottom: SPACING.sm },
    notifActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    actionChip: { paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.full },
    actionChipTxt: { fontSize: FONT.xs, fontWeight: '700' },
    dismissBtn: { marginLeft: 'auto', padding: 4 },
    dismissTxt: { fontSize: FONT.sm, color: COLORS.textMuted },

    emptyBox: { alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
    emptyIcon: { fontSize: 50, marginBottom: SPACING.md },
    emptyTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
    emptyTxt: { fontSize: FONT.sm, color: COLORS.textMuted },
});
