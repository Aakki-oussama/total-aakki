import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { HistoryItem } from '@/types/views';
import { styles, COLORS, formatDH } from './HistoryPDF.styles';

interface HistoryPDFProps {
    items: HistoryItem[];
    entityName: string;
    entityType: 'client' | 'societe';
    periodLabel: string;
    stats: {
        totalGasoil: number;
        totalPaid: number;
        initialBalance: number;
        finalBalance: number;
    };
}

export const HistoryPDF = ({ items, entityName, periodLabel, stats }: HistoryPDFProps) => (
    <Document title={`Historique - ${entityName}`}>
        {/* Format Ticket TPE 80mm large (226pt) */}
        <Page size={[226, 842]} style={styles.page}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.brandName}>TOTAL ÉNERGIES</Text>
                    <Text style={styles.brandSub}>Station Service Boumia</Text>
                    <Text style={styles.ticketTitle}>HISTORIQUE</Text>
                </View>

                {/* Infos Session */}
                <View style={styles.infoLine}>
                    <Text style={{ fontSize: 7, color: COLORS.textMuted }}>Date: {new Date().toLocaleDateString('fr-FR')}</Text>
                    <Text style={{ fontSize: 7, color: COLORS.textMuted }}>Heure: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.infoLine}>
                        <Text style={styles.infoLabel}>Destinataire</Text>
                        <Text style={styles.infoValue}>{entityName.toUpperCase()}</Text>
                    </View>
                    <View style={styles.infoLine}>
                        <Text style={styles.infoLabel}>Période</Text>
                        <Text style={styles.infoValue}>{periodLabel}</Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.infoLabel, styles.colDate]}>Date</Text>
                    <Text style={[styles.infoLabel, styles.colDesc]}>Description</Text>
                    <Text style={[styles.infoLabel, styles.colPrice, { textAlign: 'right' }]}>Montant</Text>
                </View>

                {/* Items */}
                {items.map((item, index) => (
                    <View key={item.id || index} style={styles.tableRow}>
                        <View style={styles.colDate}>
                            <Text style={styles.dateText}>
                                {new Date(item.date_operation).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                            </Text>
                        </View>
                        <View style={styles.colDesc}>
                            <Text style={styles.descMain}>{item.type}</Text>
                            <Text style={styles.descSub}>{item.description}</Text>
                        </View>
                        <View style={styles.colPrice}>
                            <Text style={[
                                styles.priceText,
                                { color: item.debit > 0 ? COLORS.danger : COLORS.success }
                            ]}>
                                {item.debit > 0 ? `-${formatDH(item.debit)}` : `+${formatDH(item.credit)}`}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* Summary Box */}
                {(() => {
                    const estDette = stats.finalBalance < 0;
                    return (
                        <View style={styles.summary}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total Consommé</Text>
                                <Text style={styles.summaryValue}>{formatDH(stats.totalGasoil)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Totals Avances</Text>
                                <Text style={styles.summaryValue}>{formatDH(stats.totalPaid)}</Text>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>
                                    {estDette ? 'RESTE À PAYER' : 'RESTE À CONSOMMER'}
                                </Text>
                                <Text style={styles.totalValue}>{formatDH(Math.abs(stats.finalBalance))}</Text>
                            </View>
                        </View>
                    );
                })()}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.thanks}>MERCI DE VOTRE VISITE</Text>
                    <Text style={styles.footerSub}>Logiciel de Gestion Total-Energies - Boumia</Text>
                </View>
            </View>
        </Page>
    </Document>
);
