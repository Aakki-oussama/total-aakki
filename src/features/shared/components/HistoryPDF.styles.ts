import { StyleSheet } from '@react-pdf/renderer';

// Couleurs extraites de ton index.css (Tailwind Theme)
export const COLORS = {
    primary: '#4f46e5',    // Indigo 600
    background: '#f8fafc', // slate-50
    border: '#e2e8f0',     // slate-200
    textMain: '#0f172a',   // slate-900
    textMuted: '#64748b',  // slate-500
    white: '#ffffff',
    danger: '#b91c1c',     // red-700
    success: '#15803d',    // green-700
};

// Helper pour formater les prix sans le bug du "/"
export const formatDH = (val: number) => {
    const n = Math.abs(val);
    const formatted = n.toFixed(2).replace('.', ',');
    if (n < 1000) return `${formatted} DH`;

    const parts = formatted.split(',');
    let integerPart = parts[0];
    let result = '';
    while (integerPart.length > 3) {
        result = ' ' + integerPart.slice(-3) + result;
        integerPart = integerPart.slice(0, -3);
    }
    return `${integerPart}${result},${parts[1]} DH`;
};

export const styles = StyleSheet.create({
    page: {
        padding: 15,
        fontSize: 9,
        fontFamily: 'Helvetica',
        color: COLORS.textMain,
    },
    container: {
        width: '100%',
    },
    // Header Style "Ticket Premium"
    header: {
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        borderBottomStyle: 'dashed',
    },
    brandName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 1,
    },
    brandSub: {
        fontSize: 7,
        color: COLORS.textMuted,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    ticketTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 10,
        backgroundColor: COLORS.textMain,
        color: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    // Section Info
    infoBox: {
        marginVertical: 10,
        padding: 8,
        backgroundColor: COLORS.background,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    infoLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    infoLabel: {
        fontSize: 7,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    // Table Graphique style TPE
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.textMain,
        paddingVertical: 4,
        marginBottom: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        borderBottomStyle: 'dashed',
        alignItems: 'flex-start',
    },
    colDate: { width: '22%' },
    colDesc: { width: '48%' },
    colPrice: { width: '30%', textAlign: 'right' },

    dateText: { fontSize: 7, color: COLORS.textMuted },
    descMain: { fontSize: 8, fontWeight: 'bold' },
    descSub: { fontSize: 6, color: COLORS.textMuted, marginTop: 1 },
    priceText: { fontSize: 9, fontWeight: 'bold' },

    // Summary Section - Style Ticket épuré
    summary: {
        marginTop: 15,
        paddingHorizontal: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    summaryLabel: {
        fontSize: 8,
        color: COLORS.textMuted,
    },
    summaryValue: {
        fontSize: 8,
        color: COLORS.textMain,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.textMain,
        borderTopStyle: 'solid',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    // Footer
    footer: {
        marginTop: 30,
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
        borderTopStyle: 'dashed',
        paddingTop: 15,
    },
    thanks: {
        fontSize: 8,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    footerSub: {
        fontSize: 6,
        color: COLORS.textMuted,
        marginTop: 4,
    }
});
