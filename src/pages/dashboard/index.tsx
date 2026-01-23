import PageLayout from '@/components/layout/PageLayout';
import DashboardStatsUI from '@/features/dashboard/components/DashboardStatsUI';
import DebtSplitCard from '@/features/dashboard/components/DebtSplitCard';
import TodayActivityCard from '@/features/dashboard/components/TodayActivityCard';

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

                {/* 2. NEW STATS - Debt Split & Today's Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DebtSplitCard />
                    <TodayActivityCard />
                </div>
            </div>
        </PageLayout>
    );
}
