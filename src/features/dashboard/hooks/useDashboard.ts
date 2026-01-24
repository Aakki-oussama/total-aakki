import { useState, useEffect, useCallback } from 'react';
import { dashboardService, type DashboardPack } from '../services/dashboardService';
import { useToast } from '@/context/toast/useToast';

/**
 * HOOK: useDashboard
 * Centralisé: Gère tout le chargement du Dashboard en UN SEUL APPEL.
 */
export function useDashboard() {
    const [data, setData] = useState<DashboardPack | null>(null);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const pack = await dashboardService.getDashboardPack();
            setData(pack);
        } catch (err) {
            console.error(err);
            error("Erreur lors du chargement du tableau de bord");
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return {
        stats: data?.stats || null,
        topDebts: data?.top_debts || [],
        debtSplit: data?.debt_split || null,
        timeline: data?.timeline || [],
        loading,
        refresh: fetchAllData
    };
}
