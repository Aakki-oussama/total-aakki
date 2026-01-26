import { supabase } from '@/lib/supabase';
import { baseService } from '@/lib/supabase/baseService';
import { getPaginationRange, applyDateFilter } from '@/lib/supabase/queryHelpers';
import type { Gasoil } from '@/types/tables';

/**
 * Extended type for Gasoil with essential profile details
 */
export type GasoilWithDetails = Gasoil & {
    client: { nom: string; prenom: string } | null;
    societe: { nom_societe: string } | null;
    client_nom?: string;
    client_prenom?: string;
    societe_nom?: string;
};

/**
 * SERVICE: Gasoil (Dépenses)
 * Gère tout l'historique de consommation de carburant et la liaison avec les soldes.
 */
export const gasoilService = {
    /**
     * Récupère la liste paginée des consommations de gasoil.
     */
    async fetchGasoils(
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = '',
        options: { clientId?: string; societeId?: string } = {}
    ) {
        const { start, end } = getPaginationRange(page, perPage);

        let query = supabase
            .from('liste_gasoil_recherchable')
            .select(`
                *,
                client:client_id(nom, prenom),
                societe:societe_id(nom_societe)
            `, { count: 'exact' });

        // 1. Filtrage par date
        query = applyDateFilter(query, dateFilter, 'date_gasoil');

        // 2. Logique de recherche simple
        if (searchTerm.trim()) {
            query = query.ilike('search_text', `%${searchTerm.trim().toLowerCase()}%`);
        }

        // 3. Filtrage par entité
        if (options.clientId) query = query.eq('client_id', options.clientId);
        if (options.societeId) query = query.eq('societe_id', options.societeId);

        const { data, error, count } = await query
            .order('date_gasoil', { ascending: false })
            .range(start, end);

        if (error) throw error;
        return {
            items: (data || []) as GasoilWithDetails[],
            totalCount: count || 0
        };
    },

    /**
     * Création d'un enregistrement Gasoil
     */
    createGasoil: (record: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Gasoil>('gasoil', record),

    /**
     * Mise à jour d'un enregistrement Gasoil
     */
    updateGasoil: (id: string, updates: Partial<Gasoil>) =>
        baseService.update<Gasoil>('gasoil', id, updates),

    /**
     * Suppression (Soft Delete)
     */
    deleteGasoil: async (id: string) => {
        const { error } = await supabase.rpc('soft_delete_gasoil', { p_gasoil_id: id });
        if (error) throw error;
    }
};
