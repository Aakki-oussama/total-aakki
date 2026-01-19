import { supabase } from '@/lib/supabase';
import { baseService } from '@/lib/supabase/baseService';
import type { Gasoil } from '@/types/tables';
import { getPaginationRange } from '@/lib/supabase/queryHelpers';

/**
 * Extended type for Gasoil with all joined details
 */
export type GasoilWithDetails = Gasoil & {
    client: { nom: string; prenom: string } | null;
    societe: { nom_societe: string } | null;
    employe: { nom: string; prenom: string } | null;
    vehicule: { matricule: string } | null;
};

export const gasoilService = {
    async fetchGasoil(
        page: number = 1,
        perPage: number = 10,
        options: { clientId?: string; societeId?: string } = {}
    ) {
        const { start, end } = getPaginationRange(page, perPage);

        let query = supabase
            .from('gasoil')
            .select(`
                *,
                client(nom, prenom),
                societe(nom_societe),
                employe(nom, prenom),
                vehicule(matricule)
            `, { count: 'exact' })
            .is('deleted_at', null)
            .order('date_gasoil', { ascending: false });

        if (options.clientId) query = query.eq('client_id', options.clientId);
        if (options.societeId) query = query.eq('societe_id', options.societeId);

        const { data, error, count } = await query.range(start, end);

        if (error) throw error;
        return {
            items: (data || []) as GasoilWithDetails[],
            totalCount: count || 0
        };
    },

    createGasoil: (record: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
        baseService.create<Gasoil>('gasoil', record),

    // Utilise la fonction SQL pour recalculer le solde après suppression
    deleteGasoil: async (id: string) => {
        const { error } = await supabase.rpc('soft_delete_gasoil', { p_gasoil_id: id });
        if (error) throw error;
    }
};
