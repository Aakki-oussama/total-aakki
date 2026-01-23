import { Users, Building2, Fuel, Wallet } from 'lucide-react';
import { StatCard, Spinner } from '@/components/shared/ui';
import { useDashboard } from '../hooks/useDashboard';

/**
 * COMPONENT: DashboardStatsUI
 * Affiche les 4 cartes principales demandées : Gasoil, Avances, Clients, Sociétés.
 */
export default function DashboardStatsUI() {
    const { stats, loading } = useDashboard();

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {/* 1. TOTAL GASOIL (MOIS) */}
                <StatCard
                    label="Gasoil (Mois)"
                    amount={stats.gasoil_mois || 0}
                    icon={Fuel}
                    color="orange"
                    suffix="DH"
                    description="Consommation crédit"
                />

                {/* 2. TOTAL AVANCE (MOIS) */}
                <StatCard
                    label="Avances (Mois)"
                    amount={stats.avances_mois || 0}
                    icon={Wallet}
                    color="green"
                    suffix="DH"
                    description="Argent encaissé"
                />

                {/* 3. TOTAL CLIENTS */}
                <StatCard
                    label="Clients"
                    amount={stats.total_clients || 0}
                    icon={Users}
                    color="blue"
                    suffix=""
                    showDecimals={false}
                    description="Particuliers actifs"
                />

                {/* 4. TOTAL SOCIÉTÉS */}
                <StatCard
                    label="Sociétés"
                    amount={stats.total_societes || 0}
                    icon={Building2}
                    color="purple"
                    suffix=""
                    showDecimals={false}
                    description="Entreprises"
                />
            </div>

        </div>
    );
}
