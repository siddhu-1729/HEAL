import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, FlatList, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const DUMMY_MEDICINES = [
    {
        id: '1',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        timing: 'After meals',
        sideEffects: ['Nausea', 'Stomach upset', 'Diarrhea'],
        caution: 'Do not skip doses. Monitor blood sugar regularly.',
        category: 'Diabetic',
        color: ['#667EEA', '#764BA2'],
    },
    {
        id: '2',
        name: 'Atorvastatin',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '60 days',
        timing: 'Bedtime',
        sideEffects: ['Muscle pain', 'Headache', 'Constipation'],
        caution: 'Avoid grapefruit juice. Report muscle weakness immediately.',
        category: 'Cardiac',
        color: ['#F093FB', '#F5576C'],
    },
    {
        id: '3',
        name: 'Amoxicillin',
        dosage: '250mg',
        frequency: 'Three times daily',
        duration: '7 days',
        timing: 'Every 8 hours',
        sideEffects: ['Rash', 'Diarrhea', 'Nausea'],
        caution: 'Complete the full course even if feeling better. Avoid if allergic to penicillin.',
        category: 'Antibiotic',
        color: ['#4FACFE', '#00F2FE'],
    },
    {
        id: '4',
        name: 'Pantoprazole',
        dosage: '40mg',
        frequency: 'Once daily',
        duration: '14 days',
        timing: '30 min before breakfast',
        sideEffects: ['Headache', 'Flatulence', 'Abdominal pain'],
        caution: 'Take on empty stomach for best effect.',
        category: 'Gastric',
        color: ['#43E97B', '#38F9D7'],
    },
];

const CATEGORY_COLORS = {
    Diabetic: { bg: '#EDE9FE', text: '#5B21B6' },
    Cardiac: { bg: '#FCE7F3', text: '#9D174D' },
    Antibiotic: { bg: '#DBEAFE', text: '#1E40AF' },
    Gastric: { bg: '#D1FAE5', text: '#065F46' },
};

export default function ScriptAnalyzerScreen({ navigation }) {
    const [files, setFiles] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast({ ...toast, visible: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = (message, type = 'info') => {
        setToast({ visible: true, message, type });
    };

    const handleUpload = () => {
        setShowUploadModal(true);
    };

    const handleCameraLaunch = () => {
        setShowUploadModal(false);
        launchCamera(
            { mediaType: 'photo', quality: 0.8 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    showToast(response.errorMessage ?? 'Failed to capture photo.', 'error');
                    return;
                }
                const asset = response.assets?.[0];
                if (asset) {
                    const newFile = {
                        id: Math.random().toString(),
                        name: asset.fileName ?? 'prescription.jpg',
                        type: 'photo',
                        uri: asset.uri,
                    };
                    setFiles((prev) => [...prev, newFile]);
                    showToast('Photo added successfully!', 'success');
                }
            }
        );
    };

    const handleGalleryLaunch = () => {
        setShowUploadModal(false);
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, selectionLimit: 0 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    showToast(response.errorMessage ?? 'Failed to pick images.', 'error');
                    return;
                }
                const assets = response.assets ?? [];
                if (assets.length > 0) {
                    const newFiles = assets.map((asset, idx) => ({
                        id: Math.random().toString(),
                        name: asset.fileName ?? `prescription_${files.length + idx + 1}.jpg`,
                        type: 'gallery',
                        uri: asset.uri,
                    }));
                    setFiles((prev) => [...prev, ...newFiles]);
                    showToast(`${newFiles.length} image(s) added successfully!`, 'success');
                }
            }
        );
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
        showToast('File removed', 'info');
    };

    const clearAllFiles = () => {
        setFiles([]);
        setShowResults(false);
    };

    const handleAnalyze = () => {
        if (files.length === 0) { 
            showToast('Please upload at least one prescription first.', 'warning');
            return; 
        }
        setAnalyzing(true);
        setTimeout(() => { setAnalyzing(false); setShowResults(true); }, 2000);
    };

    const renderMedicineCard = ({ item }) => {
        const isOpen = expanded === item.id;
        const catStyle = CATEGORY_COLORS[item.category] ?? { bg: COLORS.primaryLight, text: COLORS.primary };

        return (
            <TouchableOpacity
                style={styles.medCard}
                onPress={() => setExpanded(isOpen ? null : item.id)}
                activeOpacity={0.85}
            >
                {/* Card header */}
                <View style={styles.medHeader}>
                    <LinearGradient colors={item.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.medIconBox}>
                        <Text style={styles.medIconTxt}>💊</Text>
                    </LinearGradient>
                    <View style={styles.medInfo}>
                        <View style={styles.medNameRow}>
                            <Text style={styles.medName}>{item.name}</Text>
                            <View style={[styles.catPill, { backgroundColor: catStyle.bg }]}>
                                <Text style={[styles.catTxt, { color: catStyle.text }]}>{item.category}</Text>
                            </View>
                        </View>
                        <Text style={styles.medDosage}>{item.dosage}  ·  {item.frequency}</Text>
                        <Text style={styles.medTiming}>⏰ {item.timing}</Text>
                    </View>
                    <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
                </View>

                {/* Expanded detail */}
                {isOpen && (
                    <View style={styles.medDetail}>
                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailKey}>Duration</Text>
                            <Text style={styles.detailVal}>{item.duration}</Text>
                        </View>

                        <Text style={styles.detailSectionTitle}>Side Effects</Text>
                        <View style={styles.sideEffectsRow}>
                            {item.sideEffects.map(se => (
                                <View key={se} style={styles.sePill}>
                                    <Text style={styles.seTxt}>{se}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.cautionBox}>
                            <Text style={styles.cautionIcon}>⚠️</Text>
                            <Text style={styles.cautionTxt}>{item.caution}</Text>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>

                {/* Header */}
                <LinearGradient colors={COLORS.gradAccent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIconWrap}>
                        <Text style={styles.headerMainIcon}>🧾</Text>
                    </View>
                    <Text style={styles.headerTitle}>Script Analyzer</Text>
                    <Text style={styles.headerSub}>Upload your prescription for AI-powered medicine analysis</Text>
                </LinearGradient>

                {/* Upload Section */}
                {!showResults && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upload Prescription</Text>

                        <TouchableOpacity
                            style={[styles.uploadBox, files.length > 0 && styles.uploadBoxDone]}
                            onPress={handleUpload} activeOpacity={0.85}
                        >
                            <Text style={styles.uploadIcon}>{files.length > 0 ? '✅' : '📄'}</Text>
                            <Text style={styles.uploadTitle}>
                                {files.length > 0 ? `${files.length} file(s) selected` : 'Tap to upload prescription'}
                            </Text>
                            <Text style={styles.uploadSub}>
                                {files.length > 0 ? 'Ready for analysis' : 'Supports JPG · PNG only'}
                            </Text>
                        </TouchableOpacity>

                        {/* Display uploaded files */}
                        {files.length > 0 && (
                            <View style={styles.fileListContainer}>
                                <View style={styles.fileListHeader}>
                                    <Text style={styles.fileListTitle}>Uploaded Files ({files.length})</Text>
                                    <TouchableOpacity onPress={handleUpload}>
                                        <Text style={styles.addMoreBtn}>+ Add More</Text>
                                    </TouchableOpacity>
                                </View>
                                {files.map(file => (
                                    <View key={file.id} style={styles.fileItem}>
                                        <Text style={styles.fileIcon}>📄</Text>
                                        <View style={styles.fileInfo}>
                                            <Text style={styles.fileName}>{file.name}</Text>
                                            <Text style={styles.fileType}>{file.type}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => removeFile(file.id)}>
                                            <Text style={styles.removeBtn}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.infoBanner}>
                            <Text style={styles.infoIconTxt}>🔒</Text>
                            <Text style={styles.infoText}>
                                Your prescription is processed securely. We extract medicine details using OCR + AI.
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.analyzeBtn, files.length === 0 && styles.analyzeBtnOff]}
                            onPress={handleAnalyze} disabled={analyzing} activeOpacity={0.85}
                        >
                            {analyzing ? (
                                <View style={styles.analyzeRow}>
                                    <ActivityIndicator color={COLORS.textInverse} size="small" />
                                    <Text style={[styles.analyzeTxt, { marginLeft: 10 }]}>Extracting medicines...</Text>
                                </View>
                            ) : (
                                <Text style={styles.analyzeTxt}>🔍  Analyze Prescription</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Results */}
                {showResults && (
                    <View style={styles.section}>
                        {/* Summary strip */}
                        <View style={styles.summaryStrip}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryVal}>{DUMMY_MEDICINES.length}</Text>
                                <Text style={styles.summaryKey}>Medicines</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryVal}>3</Text>
                                <Text style={styles.summaryKey}>Active</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryVal}>1</Text>
                                <Text style={styles.summaryKey}>Caution</Text>
                            </View>
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Detected Medicines</Text>
                            <TouchableOpacity onPress={clearAllFiles}>
                                <Text style={styles.reuploadTxt}>Re-upload ↻</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={DUMMY_MEDICINES}
                            renderItem={renderMedicineCard}
                            keyExtractor={i => i.id}
                            scrollEnabled={false}
                        />

                        {/* Set Reminders button */}
                        <TouchableOpacity
                            style={styles.reminderBtn}
                            onPress={() => showToast('Dosage reminders coming soon!', 'info')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.reminderBtnTxt}>🔔  Set Dosage Reminders</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>

            {/* Upload Modal */}
            <Modal
                visible={showUploadModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUploadModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Prescription</Text>
                        <Text style={styles.modalSubtitle}>Choose upload method</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={handleCameraLaunch}>
                            <Text style={styles.modalButtonIcon}>📷</Text>
                            <View>
                                <Text style={styles.modalButtonText}>Take Photo</Text>
                                <Text style={styles.modalButtonDesc}>Capture prescription photo</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={handleGalleryLaunch}>
                            <Text style={styles.modalButtonIcon}>🖼️</Text>
                            <View>
                                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                                <Text style={styles.modalButtonDesc}>Select multiple images/documents</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonCancel]}
                            onPress={() => setShowUploadModal(false)}
                        >
                            <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Toast Notification */}
            {toast.visible && (
                <View style={[styles.toast, styles[`toast${toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}`]]}>
                    <Text style={styles.toastIcon}>
                        {toast.type === 'error' ? '❌' : toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </Text>
                    <Text style={styles.toastText}>{toast.message}</Text>
                </View>
            )}
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
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    reuploadTxt: { fontSize: FONT.sm, color: COLORS.accent, fontWeight: '700' },

    uploadBox: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', paddingVertical: SPACING.xxxl, alignItems: 'center', ...SHADOW.sm },
    uploadBoxDone: { borderColor: COLORS.accent, borderStyle: 'solid', backgroundColor: COLORS.accentLight },
    uploadIcon: { fontSize: 42, marginBottom: SPACING.md },
    uploadTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
    uploadSub: { fontSize: FONT.sm, color: COLORS.textMuted },

    infoBanner: { flexDirection: 'row', backgroundColor: COLORS.accentLight, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'flex-start', marginTop: SPACING.lg },
    infoIconTxt: { fontSize: 16, marginRight: SPACING.sm, marginTop: 1 },
    infoText: { flex: 1, fontSize: FONT.sm, color: COLORS.accentDark, lineHeight: 18 },

    analyzeBtn: { marginTop: SPACING.lg, backgroundColor: COLORS.accent, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, alignItems: 'center', ...SHADOW.md },
    analyzeBtnOff: { backgroundColor: COLORS.border, shadowOpacity: 0, elevation: 0 },
    analyzeTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.lg },
    analyzeRow: { flexDirection: 'row', alignItems: 'center' },

    summaryStrip: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOW.sm },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryVal: { fontSize: FONT.xxl, fontWeight: '800', color: COLORS.accent },
    summaryKey: { fontSize: FONT.xs, color: COLORS.textMuted, marginTop: 2 },
    summaryDivider: { width: 1, backgroundColor: COLORS.border },

    medCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, marginBottom: SPACING.md, overflow: 'hidden', ...SHADOW.sm },
    medHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
    medIconBox: { width: 46, height: 46, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    medIconTxt: { fontSize: 22 },
    medInfo: { flex: 1 },
    medNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    medName: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginRight: SPACING.sm },
    catPill: { borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2 },
    catTxt: { fontSize: 10, fontWeight: '700' },
    medDosage: { fontSize: FONT.sm, color: COLORS.textSecondary, marginBottom: 2 },
    medTiming: { fontSize: FONT.xs, color: COLORS.textMuted },
    chevron: { fontSize: FONT.sm, color: COLORS.textMuted, paddingLeft: SPACING.sm },

    medDetail: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
    detailDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.md },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
    detailKey: { fontSize: FONT.sm, color: COLORS.textMuted },
    detailVal: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textPrimary },
    detailSectionTitle: { fontSize: FONT.xs, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm },
    sideEffectsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.md },
    sePill: { backgroundColor: COLORS.warningLight, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
    seTxt: { fontSize: FONT.xs, color: '#78350F', fontWeight: '600' },
    cautionBox: { flexDirection: 'row', backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'flex-start' },
    cautionIcon: { fontSize: 16, marginRight: SPACING.sm, marginTop: 1 },
    cautionTxt: { flex: 1, fontSize: FONT.sm, color: '#7F1D1D', lineHeight: 18 },

    reminderBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, alignItems: 'center', marginTop: SPACING.lg, ...SHADOW.md },
    reminderBtnTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.md },

    // File list styles
    fileListContainer: { marginTop: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
    fileListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
    fileListTitle: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.primary },
    addMoreBtn: { fontSize: FONT.xs, color: COLORS.primary, fontWeight: '700' },
    fileItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    fileIcon: { fontSize: 20, marginRight: SPACING.md },
    fileInfo: { flex: 1 },
    fileName: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
    fileType: { fontSize: FONT.xs, color: COLORS.textMuted },
    removeBtn: { fontSize: 20, color: '#EF4444', fontWeight: 'bold', width: 24, textAlign: 'center' },

    // Modal styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, paddingTop: SPACING.lg, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
    modalTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xs },
    modalSubtitle: { fontSize: FONT.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg },
    modalButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, ...SHADOW.sm },
    modalButtonIcon: { fontSize: 24, marginRight: SPACING.md },
    modalButtonText: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textPrimary },
    modalButtonDesc: { fontSize: FONT.xs, color: COLORS.textMuted, marginTop: 2 },
    modalButtonCancel: { backgroundColor: COLORS.border },
    modalButtonTextCancel: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center', flex: 1 },

    // Toast styles
    toast: { position: 'absolute', bottom: SPACING.lg, left: SPACING.lg, right: SPACING.lg, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderRadius: RADIUS.md, ...SHADOW.md },
    toastInfo: { backgroundColor: COLORS.primary },
    toastSuccess: { backgroundColor: '#10B981' },
    toastError: { backgroundColor: '#EF4444' },
    toastWarning: { backgroundColor: '#F59E0B' },
    toastIcon: { fontSize: 18, marginRight: SPACING.sm },
    toastText: { flex: 1, color: COLORS.textInverse, fontSize: FONT.sm, fontWeight: '600' },
});
