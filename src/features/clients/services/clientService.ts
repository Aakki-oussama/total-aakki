
import { supabase } from '@/lib/supabase';
import type { Client } from '@/types/tables';
import { baseService } from '@/lib/supabase/baseService';
import { applyDateFilter, getPaginationRange } from '@/lib/supabase/queryHelpers';
import { historyService } from '@/features/shared/services/historyService';

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
            .select('*, solde(solde_actuel, total_avances, total_gasoil)', { count: 'exact' })
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
        baseService.softDelete('client', id),

    async getClientById(id: string) {
        // 1. Récupérer le client et son solde
        const clientQuery = supabase
            .from('client')
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
            .eq('client_id', id)
            .is('deleted_at', null);

        const [clientRes, gasoilRes] = await Promise.all([clientQuery, gasoilCountQuery]);

        if (clientRes.error) throw clientRes.error;

        // Formater le résultat avec sécurité sur le solde et ajout du count
        const data = clientRes.data;
        const result = {
            ...data,
            total_transactions: gasoilRes.count || 0,
            solde: Array.isArray(data.solde)
                ? (data.solde[0] || { solde_actuel: 0, total_avances: 0, total_gasoil: 0 })
                : (data.solde || { solde_actuel: 0, total_avances: 0, total_gasoil: 0 })
        };

        return result;
    },

    async getClientHistory(
        clientId: string,
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        return historyService.fetchHistory({
            entityType: 'client',
            entityId: clientId,
            page,
            perPage,
            searchTerm,
            dateFilter
        });
    },

    async getClientHistoryAll(
        clientId: string,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        const { items } = await historyService.fetchHistory({
            entityType: 'client',
            entityId: clientId,
            searchTerm,
            dateFilter,
            all: true
        });
        return items;
    }
};
