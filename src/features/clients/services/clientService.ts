
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
            .from('view_clients_avec_solde')
            .select('*', { count: 'exact' });
        // .is('deleted_at', null); // View already handles deleted_at checks

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
        // 1. Récupérer le client et son solde via la VUE
        const clientQuery = supabase
            .from('view_clients_avec_solde')
            .select('*')
            .eq('id', id)
            .single();

        // 2. Récupérer le nombre total de transactions gasoil (Table Gasoil)
        const gasoilCountQuery = supabase
            .from('gasoil')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', id)
            .is('deleted_at', null);

        const [clientRes, gasoilRes] = await Promise.all([clientQuery, gasoilCountQuery]);

        if (clientRes.error) throw clientRes.error;

        // Formater le résultat pour matcher l'interface attendue par le Frontend
        // Le frontend attend un objet 'solde' imbriqué
        const data = clientRes.data;
        const result = {
            id: data.id,
            nom: data.nom,
            prenom: data.prenom,
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
