import { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Modal, Button, Spinner } from '@/components/shared/ui';
import { historyService } from '../services/historyService';
import { HistoryPDF } from './HistoryPDF';
import { useToast } from '@/context/toast/useToast';

interface HistoryExportProps {
    entityId: string;
    entityType: 'client' | 'societe';
    entityName: string;
}

export default function HistoryExport({ entityId, entityType, entityName }: HistoryExportProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const { success, error } = useToast();

    const generatePDF = async (periodType: 'all' | 'month') => {
        try {
            setLoading(true);

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
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2"
            >
                <Download size={18} />
                <span className="hidden sm:inline">Exporter</span>
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Choisir la période"
                size="sm"
            >
                <div className="space-y-6 py-2">
                    {/* Option 1: Tout */}
                    <button
                        onClick={() => generatePDF('all')}
                        disabled={loading}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-muted group-hover:text-primary" />
                            <span className="font-bold text-main">Toute la période</span>
                        </div>
                    </button>

                    {/* Diviseur */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider">
                        <div className="h-px flex-1 bg-border" />
                        <span>Ou choisir un mois</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Option 2: Mois spécifique */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface text-main font-medium"
                            />
                        </div>
                        <Button
                            className="w-full py-6"
                            onClick={() => generatePDF('month')}
                            disabled={loading || !selectedMonth}
                        >
                            {loading ? <Spinner size="sm" /> : "Exporter ce mois"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
