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

/**
 * SERVICE: Dashboard
 * Utilise la vue view_dashboard_global pour récupérer les statistiques en temps réel.
 */
export const dashboardService = {
    async getGlobalStats() {
        const { data, error } = await supabase
            .from('view_dashboard_global')
            .select('*')
            .single();

        if (error) throw error;
        return data as DashboardGlobal;
    },

    /**
     * Récupère la répartition des dettes entre clients et sociétés
     * Utilise view_impayes pour obtenir les détails
     */
    async getDebtSplit(): Promise<DebtSplit> {
        const { data, error } = await supabase
            .from('view_impayes')
            .select('type_entite, montant_du_positif');

        if (error) throw error;

        const impayes = data as Impaye[];

        // Agrégation par type
        const clients = impayes.filter(i => i.type_entite === 'CLIENT');
        const societes = impayes.filter(i => i.type_entite === 'SOCIETE');

        const clientAmount = clients.reduce((sum, i) => sum + i.montant_du_positif, 0);
        const societeAmount = societes.reduce((sum, i) => sum + i.montant_du_positif, 0);

        return {
            clients: {
                count: clients.length,
                amount: clientAmount
            },
            societes: {
                count: societes.length,
                amount: societeAmount
            },
            total: clientAmount + societeAmount
        };
    }
};
