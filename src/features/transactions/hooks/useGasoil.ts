import { useMemo } from 'react';
import { gasoilService, type GasoilWithDetails } from '../services/gasoilService';
import { useServerResource } from '@/lib/hooks/useServerResource';
import { useToast } from '@/context/toast/useToast';
import type { Gasoil } from '@/types/tables';

/**
 * HOOK: useGasoil
 * Centralise la logique d'affichage et de manipulation des consommations de carburant.
 */
export function useGasoil(options: { clientId?: string; societeId?: string } = {}) {
    const { success, error: toastError } = useToast();

    // Configuration de la ressource serveur
    const fetchConfig = useMemo(() => ({
        clientId: options.clientId,
        societeId: options.societeId
    }), [options.clientId, options.societeId]);

    const {
        items: gasoils,
        totalCount,
        loading,
        error,
        isSubmitting,
        pagination,
        filters,
        modals,
        refresh,
        handleFormSubmit: genericSubmit,
        handleDelete: genericDelete
    } = useServerResource<GasoilWithDetails, [typeof fetchConfig]>(
        gasoilService.fetchGasoils,
        {
            entityName: 'Gasoil',
            onCreateMessage: 'Consommation enregistrée avec succès',
            onUpdateMessage: 'Consommation mise à jour avec succès'
        },
        [fetchConfig]
    );

    /**
     * Soumission du formulaire (Création ou Modification)
     */
    const handleFormSubmit = async (formData: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        const action = modals.selectedItem
            ? (data: typeof formData) => gasoilService.updateGasoil(modals.selectedItem!.id, data) as unknown as Promise<GasoilWithDetails>
            : (data: typeof formData) => gasoilService.createGasoil(data) as unknown as Promise<GasoilWithDetails>;

        try {
            await genericSubmit(action, formData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Une erreur est survenue';
            toastError(message);
        }
    };

    /**
     * Confirmation de suppression avec mise à jour du solde
     */
    const handleDeleteConfirm = async () => {
        try {
            await genericDelete(async (id) => {
                await gasoilService.deleteGasoil(id);
            });
            success('Consommation supprimée et solde mis à jour');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
            toastError(message);
        }
    };

    return {
        gasoils,
        totalCount,
        loading,
        error,
        isSubmitting,

        // Pagination
        pagination,

        // Filtres
        filters,

        // Modals & Handlers
        modals,
        handleFormSubmit,
        handleDeleteConfirm,
        refresh
    };
}
