
import { supabase } from '@/lib/supabase';
import type { Client } from '@/types/tables';
import { baseService } from '@/lib/supabase/baseService';
import { applyDateFilter, getPaginationRange } from '@/lib/supabase/queryHelpers';

/**
 * SERVICE: Clients
 */
export const clientService = {
    async fetchClients(
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        const { start, end } = getPaginationRange(page, perPage);

        let query = supabase
            .from('client')
            .select('*', { count: 'exact' })
            .is('deleted_at', null);

        if (searchTerm.trim()) {
            query = query.or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`);
        }

        query = applyDateFilter(query, dateFilter);

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(start, end);

        if (error) throw error;
        return {
            items: data as Client[],
            totalCount: count || 0
        };
    },

    createClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Client>('client', client),

    updateClient: (id: string, updates: Partial<Client>) =>
        baseService.update<Client>('client', id, updates),

    deleteClient: (id: string) =>
        baseService.softDelete('client', id)
};
