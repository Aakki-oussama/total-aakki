import PageLayout from '@/components/layout/PageLayout';
import DashboardStatsUI from '@/features/dashboard/components/DashboardStatsUI';
import DebtSplitCard from '@/features/dashboard/components/DebtSplitCard';
import TodayActivityCard from '@/features/dashboard/components/TodayActivityCard';
import TopDebtsCard from '@/features/dashboard/components/TopDebtsCard';
import ActivityTimeline from '@/features/dashboard/components/ActivityTimeline';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { Spinner } from '@/components/shared/ui';

/**
 * PAGE: Dashboard
 * Point d'entrée principal de l'application avec les statistiques clés.
 * Optimisé: Un seul appel pour tout charger.
 */
export default function DashboardPage() {
    const { stats, topDebts, debtSplit, timeline, loading } = useDashboard();

    return (
        <PageLayout
            title="Tableau de Bord"
            description="Aperçu global de l'activité de votre station service."
            variant="content"
        >
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Spinner size="lg" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* 1. Cartes de statistiques */}
                    <DashboardStatsUI stats={stats} />

                    {/* 2. ANALYSES - Debt Split & Today's Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DebtSplitCard data={debtSplit} />
                        <TodayActivityCard stats={stats} />
                    </div>

                    {/* 3. OPÉRATIONS - Red List & Timeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TopDebtsCard debts={topDebts} />
                        <ActivityTimeline activities={timeline} />
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
