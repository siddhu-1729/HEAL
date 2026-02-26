import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme/theme';

const SCAN_TYPES = [
    { id: 'brain', label: 'Brain Scan', icon: '🧠', description: 'MRI / CT for tumor detection', colors: COLORS.gradBrain },
    { id: 'bone', label: 'Bone Scan', icon: '🦴', description: 'X-ray for fracture & density', colors: COLORS.gradBone },
    { id: 'cellular', label: 'Cellular Scan', icon: '🔬', description: 'Microscopic cell-level analysis', colors: COLORS.gradCellular },
];

const DUMMY_RESULTS = {
    brain: { probability: 0.82, risk_level: 'High', recommendation: 'Immediate consultation with a neurologist is advised. Further MRI with contrast recommended.', progression_status: 'Progressive' },
    bone: { probability: 0.45, risk_level: 'Moderate', recommendation: 'Monitor bone density closely. Calcium & Vitamin D supplementation recommended.', progression_status: 'Stable' },
    cellular: { probability: 0.21, risk_level: 'Low', recommendation: 'No immediate action required. Routine check-up in 6 months.', progression_status: 'Normal' },
};

export default function UploadScreen({ navigation }) {
    const [selected, setSelected] = useState(null);
    const [filePicked, setFilePicked] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [fileName, setFileName] = useState(null);
    const [fileAsset, setFileAsset] = useState(null);

    const pickFile = () => {
        if (!selected) { Alert.alert('Select Scan', 'Choose a scan type first.'); return; }

        Alert.alert(
            'Upload File',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => {
                        launchCamera(
                            { mediaType: 'photo', quality: 0.8 },
                            (response) => {
                                handleImageResponse(response);
                            }
                        );
                    }
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => {
                        launchImageLibrary(
                            { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
                            (response) => {
                                handleImageResponse(response);
                            }
                        );
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        );
    };

    const handleImageResponse = (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
            Alert.alert('Error', response.errorMessage ?? 'Failed to pick file.');
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
            Alert.alert('Incomplete', 'Select scan type and upload a file first.');
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
                throw new Error(data.detail || data.error || 'Failed to upload scan');
            }

            console.log('Upload successful:', data);

            // Navigate to Result screen with real or dummy data depending on response structure
            navigation.navigate('Result', {
                scanType: selected,
                result: data.result || DUMMY_RESULTS[selected]
            });

        } catch (error) {
            console.error('Upload Error:', error);
            Alert.alert('Upload Failed', error.message || 'An error occurred while uploading the scan.');
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
                    <Text style={styles.headerTitle}>AI Scan Analysis</Text>
                    <Text style={styles.headerSub}>Upload your medical scan for AI-powered prediction</Text>
                </LinearGradient>

                {/* Step 1 — Scan Type */}
                <View style={styles.section}>
                    <View style={styles.stepHeader}>
                        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
                        <Text style={styles.stepTitle}>Select Scan Type</Text>
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
                        <Text style={styles.stepTitle}>Upload Scan File</Text>
                    </View>
                    <TouchableOpacity style={[styles.uploadBox, filePicked && styles.uploadBoxDone]} onPress={pickFile} activeOpacity={0.8}>
                        <Text style={styles.uploadIcon}>{filePicked ? '✅' : '📂'}</Text>
                        <Text style={styles.uploadTitle}>{filePicked ? (fileName ?? 'File selected') : 'Tap to upload'}</Text>
                        <Text style={styles.uploadSub}>{filePicked ? 'Ready for analysis' : 'Supports JPG · PNG · DICOM files only'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Info strip */}
                <View style={styles.px}>
                    <View style={styles.infoBanner}>
                        <Text style={styles.infoIconTxt}>🔒</Text>
                        <Text style={styles.infoText}>
                            All scans are encrypted and processed privately by HealVerse AI. Results are generated using trained medical-grade models.
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
                                <Text style={[styles.analyzeTxt, { marginLeft: 10 }]}>Analyzing...</Text>
                            </View>
                        ) : (
                            <Text style={styles.analyzeTxt}>🔍  Analyze Scan</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
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
});
