
import { supabase } from '@/lib/supabase';
import type { Societe } from '@/types/tables';
import { baseService } from '@/lib/supabase/baseService';
import { applyDateFilter, getPaginationRange } from '@/lib/supabase/queryHelpers';

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
            .select('*', { count: 'exact' })
            .is('deleted_at', null);

        if (searchTerm.trim()) {
            query = query.ilike('nom_societe', `%${searchTerm}%`);
        }

        query = applyDateFilter(query, dateFilter);

        const { data, error, count } = await query
            .order('nom_societe', { ascending: true })
            .range(start, end);

        if (error) throw error;
        return {
            items: data as Societe[],
            totalCount: count || 0
        };
    },

    createSociete: (societe: Omit<Societe, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Societe>('societe', societe),

    async createSocieteComplete(payload: {
        nom_societe: string;
        employes: { nom: string; prenom: string }[];
        vehicules: { matricule: string }[];
    }) {
        const { data, error } = await supabase.rpc('create_societe_complete', {
            p_nom_societe: payload.nom_societe,
            p_employes: payload.employes,
            p_vehicules: payload.vehicules
        });

        if (error) throw error;
        return data as Societe;
    },

    updateSociete: (id: string, updates: Partial<Societe>) =>
        baseService.update<Societe>('societe', id, updates),

    deleteSociete: (id: string) =>
        baseService.softDelete('societe', id),

    getSocieteById: (id: string) =>
        baseService.getById<Societe>('societe', id)
};
