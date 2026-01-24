import { supabase } from '@/lib/supabase';
import type { DashboardGlobal, Impaye } from '@/types/views';

export interface DebtSplit {
    clients: {
        count: number;
        amount: number;
    };
    societes: {
        count: number;
        amount: number;
    };
    total: number;
}

export interface DashboardPack {
    stats: DashboardGlobal;
    top_debts: Impaye[];
    debt_split: DebtSplit;
    timeline: any[];
}

/**
 * SERVICE: Dashboard
 * Optimisé: Utilise un appel unique (RPC) pour charger tout le dashboard.
 */
export const dashboardService = {
    /**
     * APPEL UNIQUE: Récupère toutes les données du dashboard d'un coup
     * Remplace 10 appels séparés par 1 seul.
     */
    async getDashboardPack(): Promise<DashboardPack> {
        const { data, error } = await supabase.rpc('get_dashboard_pack');
        if (error) throw error;
        return data as DashboardPack;
    },

    // --- Anciennes méthodes (Gardées pour compatibilité si besoin) ---

    async getGlobalStats() {
        const { data, error } = await supabase
            .from('view_dashboard_global')
            .select('*')
            .single();

        if (error) throw error;
        return data as DashboardGlobal;
    },

    async getDebtSplit(): Promise<DebtSplit> {
        const { data, error } = await supabase
            .from('view_impayes')
            .select('type_entite, montant_du_positif');

        if (error) throw error;
        const impayes = data as Impaye[];
        const clients = impayes.filter(i => i.type_entite === 'CLIENT');
        const societes = impayes.filter(i => i.type_entite === 'SOCIETE');
        const clientAmount = clients.reduce((sum, i) => sum + i.montant_du_positif, 0);
        const societeAmount = societes.reduce((sum, i) => sum + i.montant_du_positif, 0);

        return {
            clients: { count: clients.length, amount: clientAmount },
            societes: { count: societes.length, amount: societeAmount },
            total: clientAmount + societeAmount
        };
    },

    async getTopDebts(): Promise<Impaye[]> {
        const { data, error } = await supabase
            .from('view_impayes')
            .select('*')
            .order('montant_du', { ascending: true })
            .limit(5);

        if (error) throw error;
        return data as Impaye[];
    },

    async getActivityTimeline() {
        const { data, error } = await supabase
            .from('view_timeline_activite')
            .select('*')
            .limit(10);

        if (error) throw error;
        return data;
    }
};
