import { useState, useEffect } from 'react';
import { AlertTriangle, Users, Building2 } from 'lucide-react';
import { dashboardService, type DebtSplit } from '../services/dashboardService';

/**
 * COMPONENT: DebtSplitCard
 * Displays debt split between Clients and Sociétés with visual bar and percentages
 * Similar design to DashboardChargesSplit
 */
const DebtSplitCard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DebtSplit>({
        clients: { count: 0, amount: 0 },
        societes: { count: 0, amount: 0 },
        total: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const debtData = await dashboardService.getDebtSplit();
                setData(debtData);
            } catch (error) {
                console.error("Error fetching debt split:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="h-48 bg-muted/10 dark:bg-gray-800 rounded-3xl animate-pulse border border-border" />;
    }

    const clientPercent = data.total > 0 ? (data.clients.amount / data.total) * 100 : 0;
    const societePercent = data.total > 0 ? (data.societes.amount / data.total) * 100 : 0;

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-border h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-main uppercase tracking-widest">Impayés (Dettes)</h3>
                    <p className="text-[10px] text-muted uppercase font-bold tracking-tighter">Clients vs Sociétés</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Visual Bar */}
                <div className="flex h-12 w-full rounded-2xl overflow-hidden border-4 border-surface dark:border-gray-900 shadow-inner">
                    <div
                        className="h-full bg-red-500 flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000"
                        style={{ width: `${clientPercent}%` }}
                    >
                        {clientPercent > 15 && `${clientPercent.toFixed(0)}%`}
                    </div>
                    <div
                        className="h-full bg-orange-500 flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000"
                        style={{ width: `${societePercent}%` }}
                    >
                        {societePercent > 15 && `${societePercent.toFixed(0)}%`}
                    </div>
                </div>

                {/* Legend - Clients */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 dark:bg-gray-900/50 border border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Clients</span>
                                <span className="text-xs text-muted font-bold flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {data.clients.count} {data.clients.count > 1 ? 'comptes' : 'compte'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-main">
                            {data.clients.amount.toLocaleString('fr-FR')} <span className="text-[10px] text-muted uppercase">DH</span>
                        </div>
                    </div>

                    {/* Legend - Sociétés */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 dark:bg-gray-900/50 border border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Sociétés</span>
                                <span className="text-xs text-muted font-bold flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {data.societes.count} {data.societes.count > 1 ? 'comptes' : 'compte'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-main">
                            {data.societes.amount.toLocaleString('fr-FR')} <span className="text-[10px] text-muted uppercase">DH</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebtSplitCard;
