import { supabase } from '@/lib/supabase';
import type { Societe } from '@/types/tables';
import { baseService } from '@/lib/supabase/baseService';
import { applyDateFilter, getPaginationRange } from '@/lib/supabase/queryHelpers';
import { historyService } from '@/features/shared/services/historyService';

/**
 * SERVICE: Societes
 */
export const societeService = {
    async fetchSocietes(
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        const { start, end } = getPaginationRange(page, perPage);

        let query = supabase
            .from('view_societes_avec_solde')
            .select('*', { count: 'exact' });
        // .is('deleted_at', null); // View handles this

        if (searchTerm.trim()) {
            query = query.ilike('nom_societe', `%${searchTerm}%`);
        }

        query = applyDateFilter(query, dateFilter);

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(start, end);

        if (error) throw error;
        return {
            items: data as Societe[],
            totalCount: count || 0
        };
    },

    createSociete: (societe: Omit<Societe, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Societe>('societe', societe),

    updateSociete: (id: string, updates: Partial<Societe>) =>
        baseService.update<Societe>('societe', id, updates),

    deleteSociete: (id: string) =>
        baseService.softDelete('societe', id),

    async getSocieteById(id: string) {
        // 1. Récupérer la société via la VUE
        const societeQuery = supabase
            .from('view_societes_avec_solde')
            .select('*')
            .eq('id', id)
            .single();

        // 2. Récupérer le nombre total de transactions gasoil
        const gasoilCountQuery = supabase
            .from('gasoil')
            .select('*', { count: 'exact', head: true })
            .eq('societe_id', id)
            .is('deleted_at', null);

        const [societeRes, gasoilRes] = await Promise.all([societeQuery, gasoilCountQuery]);

        if (societeRes.error) throw societeRes.error;

        // Formater le résultat pour matcher l'interface attendue par le Frontend
        const data = societeRes.data;
        const result = {
            id: data.id,
            nom_societe: data.nom_societe,
            created_at: data.created_at,
            updated_at: data.updated_at,
            total_transactions: gasoilRes.count || 0,
            solde: {
                solde_actuel: data.solde_actuel,
                total_avances: data.total_avances,
                total_gasoil: data.total_gasoil
            }
        };

        return result;
    },

    async getSocieteHistory(
        societeId: string,
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        return historyService.fetchHistory({
            entityType: 'societe',
            entityId: societeId,
            page,
            perPage,
            searchTerm,
            dateFilter
        });
    },

    async getSocieteHistoryAll(
        societeId: string,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        const { items } = await historyService.fetchHistory({
            entityType: 'societe',
            entityId: societeId,
            searchTerm,
            dateFilter,
            all: true
        });
        return items;
    }
};
