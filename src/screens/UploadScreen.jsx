import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { useAppTheme } from '../context/AppContext';

const getScanTypes = (s) => [
    { id: 'brain', label: s.brainScan, icon: '🧠', description: s.brainDesc, colors: COLORS.gradBrain },
    { id: 'bone', label: s.boneScan, icon: '🦴', description: s.boneDesc, colors: COLORS.gradBone },
    { id: 'cellular', label: s.cellularScan, icon: '🔬', description: s.cellularDesc, colors: COLORS.gradCellular },
];

const DUMMY_RESULTS = {
    brain: { probability: 0.82, risk_level: 'High', recommendation: 'Immediate consultation with a neurologist is advised. Further MRI with contrast recommended.', progression_status: 'Progressive' },
    bone: { probability: 0.45, risk_level: 'Moderate', recommendation: 'Monitor bone density closely. Calcium & Vitamin D supplementation recommended.', progression_status: 'Stable' },
    cellular: { probability: 0.21, risk_level: 'Low', recommendation: 'No immediate action required. Routine check-up in 6 months.', progression_status: 'Normal' },
};

export default function UploadScreen({ navigation }) {
    const { strings } = useAppTheme();
    const SCAN_TYPES = getScanTypes(strings);

    const [selected, setSelected] = useState(null);
    const [filePicked, setFilePicked] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [fileName, setFileName] = useState(null);
    const [fileAsset, setFileAsset] = useState(null);

    const [showFileOptions, setShowFileOptions] = useState(false);
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

    const pickFile = () => {
        if (!selected) {
            showToast(strings.chooseScanFirst, 'warning');
            return;
        }
        setShowFileOptions(true);
    };

    const handleCameraLaunch = () => {
        setShowFileOptions(false);
        launchCamera(
            { mediaType: 'photo', quality: 0.8 },
            (response) => {
                handleImageResponse(response);
            }
        );
    };

    const handleGalleryLaunch = () => {
        setShowFileOptions(false);
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
            (response) => {
                handleImageResponse(response);
            }
        );
    };

    const handleImageResponse = (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
            showToast(response.errorMessage ?? strings.failedPick, 'error');
            return;
        }
        const asset = response.assets?.[0];
        if (asset) {
            setFilePicked(true);
            setFileName(asset.fileName ?? 'scan_file');
            setFileAsset(asset);
        }
    };

    const analyze = async () => {
        if (!selected || !filePicked || !fileAsset) {
            showToast(strings.selectScanUpload, 'warning');
            return;
        }

        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: fileAsset.uri,
                type: fileAsset.type || 'image/jpeg',
                name: fileAsset.fileName || 'scan.jpg',
            });

            const response = await fetch('http://192.168.1.8:8000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.error || strings.uploadError);
            }

            console.log('Upload successful:', data);
            showToast(strings.scanUploaded, 'success');

            // Navigate to Result screen with real or dummy data depending on response structure
            navigation.navigate('Result', {
                scanType: selected,
                result: data.result || DUMMY_RESULTS[selected]
            });

        } catch (error) {
            console.error('Upload Error:', error);
            showToast(error.message || strings.uploadError, 'error');
        } finally {
            setAnalyzing(false);
        }
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
                        <Text style={styles.headerMainIcon}>🔬</Text>
                    </View>
                    <Text style={styles.headerTitle}>{strings.aiScanAnalysis}</Text>
                    <Text style={styles.headerSub}>{strings.uploadScanSub}</Text>
                </LinearGradient>

                {/* Step 1 — Scan Type */}
                <View style={styles.section}>
                    <View style={styles.stepHeader}>
                        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
                        <Text style={styles.stepTitle}>{strings.selectScanType}</Text>
                    </View>
                    {SCAN_TYPES.map(scan => {
                        const isSelected = selected === scan.id;
                        return (
                            <TouchableOpacity key={scan.id} style={[styles.scanCard, isSelected && styles.scanCardActive]}
                                onPress={() => { setSelected(scan.id); setFilePicked(false); }} activeOpacity={0.8}>
                                <LinearGradient colors={isSelected ? scan.colors : [COLORS.surface, COLORS.surfaceAlt]}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.scanInner}>
                                    <Text style={styles.scanIcon}>{scan.icon}</Text>
                                    <View style={styles.scanText}>
                                        <Text style={[styles.scanLabel, isSelected && { color: COLORS.textInverse }]}>{scan.label}</Text>
                                        <Text style={[styles.scanDesc, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>{scan.description}</Text>
                                    </View>
                                    {isSelected && (
                                        <View style={styles.checkCircle}>
                                            <Text style={styles.checkMark}>✓</Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Step 2 — Upload */}
                <View style={styles.section}>
                    <View style={styles.stepHeader}>
                        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
                        <Text style={styles.stepTitle}>{strings.uploadScanFile}</Text>
                    </View>
                    <TouchableOpacity style={[styles.uploadBox, filePicked && styles.uploadBoxDone]} onPress={pickFile} activeOpacity={0.8}>
                        <Text style={styles.uploadIcon}>{filePicked ? '✅' : '📂'}</Text>
                        <Text style={styles.uploadTitle}>{filePicked ? (fileName ?? strings.fileSelected) : strings.tapToUpload}</Text>
                        <Text style={styles.uploadSub}>{filePicked ? strings.readyForAnalysis : strings.supportsFiles}</Text>
                    </TouchableOpacity>
                </View>

                {/* Info strip */}
                <View style={styles.px}>
                    <View style={styles.infoBanner}>
                        <Text style={styles.infoIconTxt}>🔒</Text>
                        <Text style={styles.infoText}>
                            {strings.privacyInfo}
                        </Text>
                    </View>
                </View>

                {/* Analyze button */}
                <View style={styles.px}>
                    <TouchableOpacity
                        style={[styles.analyzeBtn, (!selected || !filePicked) && styles.analyzeBtnOff]}
                        onPress={analyze} disabled={analyzing} activeOpacity={0.85}>
                        {analyzing ? (
                            <View style={styles.analyzeRow}>
                                <ActivityIndicator color={COLORS.textInverse} size="small" />
                                <Text style={[styles.analyzeTxt, { marginLeft: 10 }]}>{strings.analyzing}</Text>
                            </View>
                        ) : (
                            <Text style={styles.analyzeTxt}>🔍  {strings.analyzeScan}</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* File Options Modal */}
            <Modal
                visible={showFileOptions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowFileOptions(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{strings.uploadFileTitle}</Text>
                        <Text style={styles.modalSubtitle}>{strings.chooseOption}</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={handleCameraLaunch}>
                            <Text style={styles.modalButtonIcon}>📷</Text>
                            <Text style={styles.modalButtonText}>{strings.takePhoto}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={handleGalleryLaunch}>
                            <Text style={styles.modalButtonIcon}>🖼️</Text>
                            <Text style={styles.modalButtonText}>{strings.chooseGallery}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonCancel]}
                            onPress={() => setShowFileOptions(false)}
                        >
                            <Text style={styles.modalButtonTextCancel}>{strings.cancel}</Text>
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
            )
            }
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    px: { paddingHorizontal: SPACING.lg },

    header: { paddingTop: SPACING.xl, paddingBottom: SPACING.xxxl, alignItems: 'center', paddingHorizontal: SPACING.lg },
    backBtn: { position: 'absolute', top: SPACING.lg, left: SPACING.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 28, color: COLORS.textInverse, lineHeight: 32 },
    headerIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 12 },
    headerMainIcon: { fontSize: 30 },
    headerTitle: { fontSize: FONT.xxl, fontWeight: '700', color: COLORS.textInverse, marginBottom: 6 },
    headerSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

    section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
    stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    stepBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
    stepBadgeText: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.sm },
    stepTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary },

    scanCard: { borderRadius: RADIUS.lg, marginBottom: SPACING.md, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', ...SHADOW.sm },
    scanCardActive: { borderColor: COLORS.primary, ...SHADOW.md },
    scanInner: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg },
    scanIcon: { fontSize: 30, marginRight: SPACING.md },
    scanText: { flex: 1 },
    scanLabel: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
    scanDesc: { fontSize: FONT.sm, color: COLORS.textSecondary },
    checkCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.28)', justifyContent: 'center', alignItems: 'center' },
    checkMark: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.base },

    uploadBox: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', paddingVertical: SPACING.xxxl, alignItems: 'center', ...SHADOW.sm },
    uploadBoxDone: { borderColor: COLORS.accent, borderStyle: 'solid', backgroundColor: COLORS.accentLight },
    uploadIcon: { fontSize: 42, marginBottom: SPACING.md },
    uploadTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
    uploadSub: { fontSize: FONT.sm, color: COLORS.textMuted },

    infoBanner: { flexDirection: 'row', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'flex-start', marginTop: SPACING.xxl },
    infoIconTxt: { fontSize: 16, marginRight: SPACING.sm, marginTop: 1 },
    infoText: { flex: 1, fontSize: FONT.sm, color: COLORS.primary, lineHeight: 18 },

    analyzeBtn: { marginTop: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, alignItems: 'center', ...SHADOW.md },
    analyzeBtnOff: { backgroundColor: COLORS.border, shadowOpacity: 0, elevation: 0 },
    analyzeTxt: { color: COLORS.textInverse, fontWeight: '700', fontSize: FONT.lg },
    analyzeRow: { flexDirection: 'row', alignItems: 'center' },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, paddingTop: SPACING.lg, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
    modalTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xs },
    modalSubtitle: { fontSize: FONT.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg },
    modalButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, ...SHADOW.sm },
    modalButtonIcon: { fontSize: 20, marginRight: SPACING.md },
    modalButtonText: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
    modalButtonCancel: { backgroundColor: COLORS.border },
    modalButtonTextCancel: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center', flex: 1 },

    // Toast Styles
    toast: { position: 'absolute', bottom: SPACING.lg, left: SPACING.lg, right: SPACING.lg, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderRadius: RADIUS.md, ...SHADOW.md },
    toastInfo: { backgroundColor: COLORS.primary },
    toastSuccess: { backgroundColor: '#10B981' },
    toastError: { backgroundColor: '#EF4444' },
    toastWarning: { backgroundColor: '#F59E0B' },
    toastIcon: { fontSize: 18, marginRight: SPACING.sm },
    toastText: { flex: 1, color: COLORS.textInverse, fontSize: FONT.sm, fontWeight: '600' },
});
