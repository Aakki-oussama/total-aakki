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
            .from('societe')
            .select('*, solde(solde_actuel, total_avances, total_gasoil)', { count: 'exact' })
            .is('deleted_at', null);

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
        // 1. Récupérer la société et son solde
        const societeQuery = supabase
            .from('societe')
            .select(`
                *,
                solde:solde(solde_actuel, total_avances, total_gasoil)
            `)
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

        // Formater le résultat avec sécurité sur le solde et ajout du count
        const data = societeRes.data;
        const result = {
            ...data,
            total_transactions: gasoilRes.count || 0,
            solde: Array.isArray(data.solde)
                ? (data.solde[0] || { solde_actuel: 0, total_avances: 0, total_gasoil: 0 })
                : (data.solde || { solde_actuel: 0, total_avances: 0, total_gasoil: 0 })
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
