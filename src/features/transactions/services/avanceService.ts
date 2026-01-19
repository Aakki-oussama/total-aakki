import { supabase } from '@/lib/supabase';
import { baseService } from '@/lib/supabase/baseService';
import type { Avance } from '@/types/tables';
import { getPaginationRange } from '@/lib/supabase/queryHelpers';

/**
 * Extended type for Avance with joined Client/Societe details
 */
export type AvanceWithDetails = Avance & {
    client: { nom: string; prenom: string } | null;
    societe: { nom_societe: string } | null;
};

/**
 * SERVICE: Avances (Paiements)
 * Handles all logic for money coming in (CASH/CHEQUE).
 */
export const avanceService = {
    /**
     * Fetch paginated list of advances with joined client/societe info
     */
    async fetchAvances(
        page: number = 1,
        perPage: number = 10,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        _searchTerm: string = '',
        _dateFilter: string = '',
        /* eslint-enable @typescript-eslint/no-unused-vars */
        options: { clientId?: string; societeId?: string } = {}
    ) {
        const { start, end } = getPaginationRange(page, perPage);

        let query = supabase
            .from('avance')
            .select(`
                *,
                client(nom, prenom),
                societe(nom_societe)
            `, { count: 'exact' })
            .is('deleted_at', null)
            .order('date_avance', { ascending: false });

        if (options.clientId) query = query.eq('client_id', options.clientId);
        if (options.societeId) query = query.eq('societe_id', options.societeId);

        const { data, error, count } = await query.range(start, end);

        if (error) throw error;
        return {
            items: (data || []) as AvanceWithDetails[],
            totalCount: count || 0
        };
    },

    /**
     * Standard creation for existing entities
     */
    createAvance: (avance: Omit<Avance, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Avance>('avance', avance),

    /**
     * Standard update for existing entities
     */
    updateAvance: (id: string, updates: Partial<Avance>) =>
        baseService.update<Avance>('avance', id, updates),

    /**
     * QUICK CREATE: Client + First Payment in one go
     */
    async createClientWithAvance(nom: string, prenom: string, montant: number) {
        const { data, error } = await supabase.rpc('create_client_avec_solde', {
            p_nom: nom,
            p_prenom: prenom,
            p_montant_initial: montant
        });
        if (error) throw error;
        return data;
    },

    /**
     * QUICK CREATE: Societe + First Payment in one go
     */
    async createSocieteWithAvance(nom_societe: string, montant: number) {
        const { data, error } = await supabase.rpc('create_societe_avec_solde', {
            p_nom_societe: nom_societe,
            p_montant_initial: montant
        });
        if (error) throw error;
        return data;
    },

    /**
     * Soft delete using SQL Function (handles automatic balance recalculation)
     */
    deleteAvance: async (id: string) => {
        const { error } = await supabase.rpc('soft_delete_avance', { p_avance_id: id });
        if (error) throw error;
    }
};
