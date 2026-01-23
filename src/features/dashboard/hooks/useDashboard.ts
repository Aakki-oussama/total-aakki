import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardGlobal } from '@/types/views';
import { useToast } from '@/context/toast/useToast';

/**
 * HOOK: useDashboard
 * Gère l'état et le chargement des statistiques globales.
 */
export function useDashboard() {
    const [stats, setStats] = useState<DashboardGlobal | null>(null);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getGlobalStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            error("Erreur lors du chargement du tableau de bord");
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        refresh: fetchStats
    };
}
