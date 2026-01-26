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

export interface TimelineItem {
    id: string;
    date_operation: string;
    type: 'GASOIL' | 'PAIEMENT';
    description: string;
    montant: number;
    type_entite: 'CLIENT' | 'SOCIETE';
    nom_entite: string;
}

export interface DashboardPack {
    stats: DashboardGlobal;
    top_debts: Impaye[];
    debt_split: DebtSplit;
    timeline: TimelineItem[];
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
};
