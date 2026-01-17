import { supabase } from '@/lib/supabase';
import type { Client } from '@/types/tables';

/**
 * SERVICE: Clients
 * Gestion des appels API pour la table 'client'
 */

export const clientService = {
    /**
     * Récupérer les clients avec pagination serveur
     * @param page - Numéro de la page (commence à 1)
     * @param perPage - Nombre de clients par page
     * @param searchTerm - Terme de recherche optionnel
     * @param dateFilter - Date de filtrage (format YYYY-MM-DD)
     */
    async fetchClients(
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = ''
    ) {
        const start = (page - 1) * perPage;
        const end = start + perPage - 1;

        let query = supabase
            .from('client')
            .select('*', { count: 'exact' })
            .is('deleted_at', null);

        // Recherche côté serveur si un terme est fourni
        if (searchTerm.trim()) {
            query = query.or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`);
        }

        // Filtre par date côté serveur (toute la journée)
        if (dateFilter.trim()) {
            const startOfDay = `${dateFilter}T00:00:00`;
            const endOfDay = `${dateFilter}T23:59:59`;
            query = query
                .gte('created_at', startOfDay)
                .lte('created_at', endOfDay);
        }

        const { data, error, count } = await query
            .order('nom', { ascending: true })
            .order('prenom', { ascending: true })
            .range(start, end);

        if (error) throw error;
        return {
            clients: data as Client[],
            totalCount: count || 0
        };
    },

    /**
     * Créer un nouveau client
     */
    async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
        const { data, error } = await supabase
            .from('client')
            .insert([client])
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    },

    /**
     * Mettre à jour un client existant
     */
    async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>) {
        const { data, error } = await supabase
            .from('client')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    },

    /**
     * Suppression logique (Soft Delete)
     */
    async deleteClient(id: string) {
        const { error } = await supabase
            .from('client')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
