import { useState } from 'react';
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Modal, Button, MonthSelector } from '@/components/shared/ui';
import { historyService } from '../services/historyService';
import { HistoryPDF } from './HistoryPDF';
import { useToast } from '@/context/toast/useToast';
import { iconConfig } from '@/config/icons';

interface HistoryExportProps {
    entityId: string;
    entityType: 'client' | 'societe';
    entityName: string;
}

export default function HistoryExport({ entityId, entityType, entityName }: HistoryExportProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingType, setLoadingType] = useState<'all' | 'month' | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const { success, error } = useToast();

    const generatePDF = async (periodType: 'all' | 'month') => {
        try {
            setLoadingType(periodType);

            let dateFilter = '';
            let periodLabel = 'Tout l\'historique';

            if (periodType === 'month') {
                const [year, month] = selectedMonth.split('-');
                const firstDay = `${selectedMonth}-01`;
                const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
                dateFilter = `${firstDay}:${lastDay}`;

                const dateObj = new Date(parseInt(year), parseInt(month) - 1);
                periodLabel = `Mois de ${dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
            }

            const { items } = await historyService.fetchHistory({
                entityType,
                entityId,
                dateFilter,
                all: true
            });

            if (items.length === 0) {
                error("Aucune donnée trouvée pour cette période");
                return;
            }

            const stats = items.reduce((acc, item) => {
                acc.totalGasoil += item.debit;
                acc.totalPaid += item.credit;
                return acc;
            }, { totalGasoil: 0, totalPaid: 0, initialBalance: 0, finalBalance: 0 });

            stats.finalBalance = items[0].solde_ligne;

            const blob = await pdf(
                <HistoryPDF
                    items={items}
                    entityName={entityName}
                    entityType={entityType}
                    periodLabel={periodLabel}
                    stats={stats}
                />
            ).toBlob();

            saveAs(blob, `Historique_${entityName.replace(/\s+/g, '_')}_${periodLabel.replace(/\s+/g, '_')}.pdf`);

            success("Export terminé avec succès");
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            error("Erreur lors de l'exportation");
        } finally {
            setLoadingType(null);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="h-[48px] w-[48px] shrink-0 aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl border border-border/60 bg-surface/80 hover:bg-surface transition-all shadow-sm group relative"
                title="Exporter l'historique"
                aria-label="Exporter l'historique"
            >
                <Download
                    className={`${iconConfig.sizes.breadcrumb} text-muted group-hover:text-primary transition-colors`}
                    strokeWidth={iconConfig.strokeWidth}
                />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Exporter l'historique"
                description="Choisissez la période de l'export."
                size="sm"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => generatePDF('all')}
                            loading={loadingType === 'all'}
                            disabled={loadingType === 'month'}
                        >
                            Tout l'historique
                        </Button>
                        <Button
                            onClick={() => generatePDF('month')}
                            loading={loadingType === 'month'}
                            disabled={loadingType === 'all' || !selectedMonth}
                        >
                            Exporter ce mois
                        </Button>
                    </>
                }
            >
                <div className="py-2 space-y-3 text-center">
                    <p className="text-[9px] uppercase tracking-wider font-bold text-muted">
                        Choisir un mois spécifique
                    </p>
                    <MonthSelector
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        className="max-w-[280px] mx-auto"
                    />
                </div>
            </Modal>
        </>
    );
}