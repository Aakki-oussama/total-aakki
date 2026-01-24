import { Wallet, Fuel, TrendingUp, TrendingDown, ClipboardCheck } from 'lucide-react';
import { StatCard } from '@/components/shared/ui';

interface SocieteStatsProps {
    solde: {
        solde_actuel: number;
        total_avances: number;
        total_gasoil: number;
    };
    totalTransactions: number;
}

/**
 * COMPONENT: SocieteStats
 * Affiche les statistiques financières d'une société.
 */
export default function SocieteStats({ solde, totalTransactions }: SocieteStatsProps) {
    const isDebt = solde.solde_actuel < 0;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <StatCard
                label="Solde Actuel"
                amount={solde.solde_actuel}
                icon={isDebt ? TrendingDown : TrendingUp}
                color={isDebt ? 'red' : 'green'}
                suffix="DH"
            />
            <StatCard
                label="Total Gasoil"
                amount={solde.total_gasoil || 0}
                icon={Fuel}
                color="orange"
                suffix="DH"
            />
            <StatCard
                label="Total Payé"
                amount={solde.total_avances || 0}
                icon={Wallet}
                color="blue"
                suffix="DH"
            />
            <StatCard
                label="Transactions"
                amount={totalTransactions || 0}
                icon={ClipboardCheck}
                color="purple"
                suffix="OPS"
                showDecimals={false}
            />
        </div>
    );
}
