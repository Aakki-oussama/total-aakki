import { supabase } from '@/lib/supabase';
import { applyDateFilter, getPaginationRange } from '@/lib/supabase/queryHelpers';
import type { HistoryItem } from '@/types/views';

/**
 * SERVICE: History (Centralisé)
 * Gère le relevé de compte pour les clients et les sociétés
 */
export const historyService = {
    /**
     * Récupère l'historique avec pagination et filtres
     */
    async fetchHistory({
        entityType,
        entityId,
        page = 1,
        perPage = 10,
        searchTerm = '',
        dateFilter = '',
        all = false
    }: {
        entityType: 'client' | 'societe';
        entityId: string;
        page?: number;
        perPage?: number;
        searchTerm?: string;
        dateFilter?: string;
        all?: boolean;
    }) {
        let query = supabase
            .from('view_releve_compte')
            .select('*', { count: all ? undefined : 'exact' })
            .eq(entityType === 'client' ? 'client_id' : 'societe_id', entityId);

        // Recherche intelligente
        if (searchTerm.trim()) {
            const isNumeric = !isNaN(Number(searchTerm)) && searchTerm.trim() !== '';
            const orFilter = isNumeric
                ? `debit.eq.${searchTerm},credit.eq.${searchTerm}`
                : `description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`;

            query = query.or(orFilter);
        }

        // Filtre de date (Plage ou Jour unique)
        query = applyDateFilter(query, dateFilter, 'date_operation');

        // Tri (Plus récent en haut)
        query = query
            .order('date_operation', { ascending: false })
            .order('created_at', { ascending: false });

        // Pagination (si pas mode "all")
        if (!all) {
            const { start, end } = getPaginationRange(page, perPage);
            query = query.range(start, end);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            items: data as HistoryItem[],
            totalCount: count || (data?.length || 0)
        };
    }
};
