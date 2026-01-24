import { AlertTriangle, Users, Building2 } from 'lucide-react';
import type { DebtSplit } from '../services/dashboardService';
import { iconConfig } from '@/config/icons';
import { Card } from '@/components/shared/ui';
import { formatCurrency } from '@/lib/supabase/helpers';

interface DebtSplitCardProps {
    data: DebtSplit | null;
}

/**
 * COMPONENT: DebtSplitCard
 * Displays debt split between Clients and Sociétés with visual bar and percentages
 */
const DebtSplitCard = ({ data }: DebtSplitCardProps) => {
    if (!data) {
        return <div className="h-48 bg-muted/10 dark:bg-gray-800 rounded-3xl animate-pulse border border-border" />;
    }

    const clientPercent = data.total > 0 ? (data.clients.amount / data.total) * 100 : 0;
    const societePercent = data.total > 0 ? (data.societes.amount / data.total) * 100 : 0;

    return (
        <Card className="h-full shadow-xl" padding="md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <AlertTriangle className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-main uppercase tracking-widest">Répartition Dettes</h3>
                    <p className="text-[10px] text-muted uppercase font-bold tracking-tighter">Clients vs Sociétés</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Visual Bar - Clean & Flat */}
                <div className="flex h-10 w-full rounded-2xl overflow-hidden bg-muted/10 border border-border/50">
                    <div
                        className="h-full bg-client flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000"
                        style={{ width: `${clientPercent}%` }}
                    >
                        {clientPercent > 15 && `${clientPercent.toFixed(0)}%`}
                    </div>
                    <div
                        className="h-full bg-societe flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000"
                        style={{ width: `${societePercent}%` }}
                    >
                        {societePercent > 15 && `${societePercent.toFixed(0)}%`}
                    </div>
                </div>

                {/* Legend - Clients */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 dark:bg-gray-900/50 border border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-client" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Clients</span>
                                <span className="text-xs text-muted font-bold flex items-center gap-1">
                                    <Users className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                                    {data.clients.count} {data.clients.count > 1 ? 'comptes' : 'compte'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-main">
                            {formatCurrency(data.clients.amount)}
                        </div>
                    </div>

                    {/* Legend - Sociétés */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 dark:bg-gray-900/50 border border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-societe" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Sociétés</span>
                                <span className="text-xs text-muted font-bold flex items-center gap-1">
                                    <Building2 className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                                    {data.societes.count} {data.societes.count > 1 ? 'comptes' : 'compte'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-main">
                            {formatCurrency(data.societes.amount)}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DebtSplitCard;
