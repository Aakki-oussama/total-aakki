import { supabase } from '@/lib/supabase';
import type { Solde } from '@/types/tables';

export const soldeService = {
    async getSoldeByClient(clientId: string) {
        const { data, error } = await supabase
            .from('solde')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // ignore not found
        return data as Solde | null;
    },

    async getSoldeBySociete(societeId: string) {
        const { data, error } = await supabase
            .from('solde')
            .select('*')
            .eq('societe_id', societeId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as Solde | null;
    },

    // Appel à la fonction RPC pour obtenir les statistiques détaillées
    async getClientStats(clientId: string) {
        const { data, error } = await supabase.rpc('get_stats_client', { p_client_id: clientId });
        if (error) throw error;
        return data[0]; // La fonction retourne une table d'une ligne
    },

    async getSocieteStats(societeId: string) {
        const { data, error } = await supabase.rpc('get_stats_societe', { p_societe_id: societeId });
        if (error) throw error;
        return data[0];
    }
};
