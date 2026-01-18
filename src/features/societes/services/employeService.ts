
import { supabase } from '@/lib/supabase';
import type { Employe } from '@/types/tables';
import { baseService } from '@/lib/supabase/baseService';
import { applyDateFilter, getPaginationRange } from '@/lib/supabase/queryHelpers';

/**
 * SERVICE: Employes
 */
export const employeService = {
    async fetchEmployes(
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = '',
        societeId?: string
    ) {
        const { start, end } = getPaginationRange(page, perPage);

        let query = supabase
            .from('employe')
            .select('*, societe(nom_societe)', { count: 'exact' })
            .is('deleted_at', null);

        if (societeId) {
            query = query.eq('societe_id', societeId);
        }

        if (searchTerm.trim()) {
            query = query.or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`);
        }

        query = applyDateFilter(query, dateFilter);

        const { data, error, count } = await query
            .order('nom', { ascending: true })
            .order('prenom', { ascending: true })
            .range(start, end);

        if (error) throw error;
        return {
            items: data as (Employe & { societe: { nom_societe: string } })[],
            totalCount: count || 0
        };
    },

    createEmploye: (employe: Omit<Employe, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Employe>('employe', employe),

    updateEmploye: (id: string, updates: Partial<Employe>) =>
        baseService.update<Employe>('employe', id, updates),

    deleteEmploye: (id: string) =>
        baseService.softDelete('employe', id)
};
