import { supabase } from '@/lib/supabase';
import type { Client } from '@/types/tables';

/**
 * SERVICE: Clients
 * Gestion des appels API pour la table 'client'
 */

export const clientService = {
    /**
     * Récupérer tous les clients (non supprimés)
     */
    async fetchClients() {
        const { data, error } = await supabase
            .from('client')
            .select('*')
            .is('deleted_at', null)
            .order('nom', { ascending: true });

        if (error) throw error;
        return data as Client[];
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
