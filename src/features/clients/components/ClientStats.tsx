import { Wallet, Fuel, TrendingUp, TrendingDown, ClipboardCheck } from 'lucide-react';
import { StatCard } from '@/components/shared/ui';

interface ClientStatsProps {
    solde: {
        solde_actuel: number;
        total_avances: number;
        total_gasoil: number;
    };
    totalTransactions: number;
    loading?: boolean;
}

/**
 * COMPONENT: ClientStats
 * Version FINALE - Connectée aux données réelles et 100% cohérente avec le design système.
 */
export default function ClientStats({ solde, totalTransactions }: ClientStatsProps) {
    const isDebt = solde.solde_actuel < 0;


    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {/* 1. Solde Actuel */}
            <StatCard
                label="Solde Actuel"
                amount={solde.solde_actuel}
                icon={isDebt ? TrendingDown : TrendingUp}
                color={isDebt ? 'red' : 'green'}
                suffix="DH"
            />

            {/* 2. Total Gasoil */}
            <StatCard
                label="Total Gasoil"
                amount={solde.total_gasoil || 0}
                icon={Fuel}
                color="orange"
                suffix="DH"
            />

            {/* 3. Total Paiements */}
            <StatCard
                label="Total Payé"
                amount={solde.total_avances || 0}
                icon={Wallet}
                color="blue"
                suffix="DH"
            />

            {/* 4. Activité (Transactions) */}
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
