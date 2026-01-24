import PageLayout from '@/components/layout/PageLayout';
import DashboardStatsUI from '@/features/dashboard/components/DashboardStatsUI';
import DebtSplitCard from '@/features/dashboard/components/DebtSplitCard';
import TodayActivityCard from '@/features/dashboard/components/TodayActivityCard';
import TopDebtsCard from '@/features/dashboard/components/TopDebtsCard';
import ActivityTimeline from '@/features/dashboard/components/ActivityTimeline';

/**
 * PAGE: Dashboard
 * Point d'entrée principal de l'application avec les statistiques clés.
 */
export default function DashboardPage() {
    return (
        <PageLayout
            title="Tableau de Bord"
            description="Aperçu global de l'activité de votre station service."
            variant="content"
        >
            <div className="space-y-8">
                {/* 1. Cartes de statistiques */}
                <DashboardStatsUI />

                {/* 2. ANALYSES - Debt Split & Today's Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DebtSplitCard />
                    <TodayActivityCard />
                </div>

                {/* 3. OPÉRATIONS - Red List & Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopDebtsCard />
                    <ActivityTimeline />
                </div>
            </div>
        </PageLayout>
    );
}
