/**
 * Heal-verse Design System — Theme
 * Single source of truth for colors, typography, shadows, spacing.
 */

export const COLORS = {
    // ── Brand ─────────────────────────────────────────
    primary: '#1A73E8',   // Google-blue, trustworthy & medical
    primaryDark: '#1557B0',
    primaryLight: '#E8F0FE',

    accent: '#00C6AE',   // Teal — medical, calming
    accentDark: '#009E8C',
    accentLight: '#E0FAF7',

    // ── Semantic ──────────────────────────────────────
    success: '#1DB954',
    successLight: '#E6F9EE',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',

    // ── Neutrals ──────────────────────────────────────
    background: '#F0F4F8',   // Very light blue-grey
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',

    // ── Text ──────────────────────────────────────────
    textPrimary: '#0F172A',   // Near-black, rich
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // ── Borders ───────────────────────────────────────
    border: '#E2E8F0',
    borderDark: '#CBD5E1',

    // ── Gradients (common pairs) ──────────────────────
    gradPrimary: ['#1A73E8', '#1557B0'],
    gradAccent: ['#00C6AE', '#009E8C'],
    gradDanger: ['#EF4444', '#B91C1C'],
    gradWarning: ['#F59E0B', '#D97706'],
    gradSuccess: ['#1DB954', '#15803D'],
    gradPurple: ['#8B5CF6', '#6D28D9'],
    gradPink: ['#EC4899', '#BE185D'],

    // ── Scan Type Gradients ───────────────────────────
    gradBrain: ['#667EEA', '#764BA2'],
    gradBone: ['#F093FB', '#F5576C'],
    gradCellular: ['#4FACFE', '#00F2FE'],
};

export const FONT = {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    h1: 28,
    h0: 34,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
};

export const SHADOW = {
    sm: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
        elevation: 7,
    },
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};
