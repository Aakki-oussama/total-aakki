
import { supabase } from '@/lib/supabase';
import type { Vehicule } from '@/types/tables';
import { baseService } from '@/lib/supabase/baseService';

/**
 * SERVICE: Vehicules
 */
export const vehiculeService = {
    async fetchVehicules(
        page: number = 1,
        perPage: number = 10,
        searchTerm: string = '',
        dateFilter: string = '',
        societeId?: string
    ) {
        const start = (page - 1) * perPage;
        const end = start + perPage - 1;

        let query = supabase
            .from('vehicule')
            .select('*, societe(nom_societe)', { count: 'exact' })
            .is('deleted_at', null);

        if (societeId) {
            query = query.eq('societe_id', societeId);
        }

        if (searchTerm.trim()) {
            query = query.ilike('matricule', `%${searchTerm}%`);
        }

        if (dateFilter.trim()) {
            const startOfDay = `${dateFilter}T00:00:00`;
            const endOfDay = `${dateFilter}T23:59:59`;
            query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
        }

        const { data, error, count } = await query
            .order('matricule', { ascending: true })
            .range(start, end);

        if (error) throw error;
        return {
            items: data as (Vehicule & { societe: { nom_societe: string } })[],
            totalCount: count || 0
        };
    },

    createVehicule: (vehicule: Omit<Vehicule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Vehicule>('vehicule', vehicule),

    updateVehicule: (id: string, updates: Partial<Vehicule>) =>
        baseService.update<Vehicule>('vehicule', id, updates),

    deleteVehicule: (id: string) =>
        baseService.softDelete('vehicule', id)
};
