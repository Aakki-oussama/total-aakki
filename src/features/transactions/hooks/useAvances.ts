import { useMemo } from 'react';
import { useServerResource } from '@/lib/hooks/useServerResource';
import { avanceService, type AvanceWithDetails } from '../services/avanceService';
import type { Avance } from '@/types/tables';
import { useToast } from '@/context/toast/useToast';

interface UseAvancesOptions {
    clientId?: string;
    societeId?: string;
    enabled?: boolean;
}

/**
 * HOOK: useAvances
 * Centralizes all finance logic for Payments (Money In).
 * Uses the generic useServerResource engine for high quality.
 */
export function useAvances(options: UseAvancesOptions = {}) {
    // Memoize extra args to prevent unnecessary re-renders in useServerResource
    const extraArgs = useMemo(() => [{
        clientId: options.clientId,
        societeId: options.societeId
    }], [options.clientId, options.societeId]);

    const { success, error: toastError } = useToast();
    const {
        items: avances,
        totalCount: totalAvances,
        loading,
        error,
        isSubmitting,
        pagination,
        filters,
        modals,
        handleFormSubmit: genericSubmit,
        handleDelete: genericDelete,
        refresh,
        setIsSubmitting
    } = useServerResource<AvanceWithDetails, [Partial<{ clientId: string; societeId: string }>]>(
        avanceService.fetchAvances,
        {
            entityName: 'Paiement',
            enabled: options.enabled
        },
        extraArgs as [Partial<{ clientId: string; societeId: string }>]
    );

    /**
     * Specialized Form Submission logic
     * Handles both updates and creates
     */
    const handleFormSubmit = async (formData: Omit<Avance, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        const submitFn = modals.selectedItem
            ? (data: typeof formData) => avanceService.updateAvance((modals.selectedItem as Avance).id, data) as unknown as Promise<AvanceWithDetails>
            : (data: typeof formData) => avanceService.createAvance(data) as unknown as Promise<AvanceWithDetails>;

        await genericSubmit(submitFn, formData);
    };

    /**
     * Specialized Quick Create (RPC)
     */
    const handleQuickCreateClient = async (payload: { nom: string; prenom: string; montant: number }) => {
        setIsSubmitting(true);
        try {
            await avanceService.createClientWithAvance(payload.nom, payload.prenom, payload.montant);
            success('Client et paiement créés avec succès');
            refresh();
            modals.closeAll();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la création';
            toastError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickCreateSociete = async (payload: { nom_societe: string; montant: number }) => {
        setIsSubmitting(true);
        try {
            await avanceService.createSocieteWithAvance(payload.nom_societe, payload.montant);
            success('Société et paiement créés avec succès');
            refresh();
            modals.closeAll();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la création';
            toastError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Specialized Delete logic
     */
    const handleDeleteConfirm = async () => {
        await genericDelete(avanceService.deleteAvance);
    };

    return {
        // Data
        avances,
        totalAvances,
        loading,
        error,
        isSubmitting,

        // Pagination
        pagination,

        // Filters
        filters,

        // Modals & Handlers
        isFormModalOpen: modals.isFormOpen,
        isDeleteModalOpen: modals.isDeleteOpen,
        selectedAvance: modals.selectedItem,
        openCreateModal: modals.openCreate,
        openEditModal: modals.openEdit,
        openDeleteModal: modals.openDelete,
        closeModals: modals.closeAll,

        // Actions
        handleFormSubmit,
        handleDeleteConfirm,
        handleQuickCreateClient,
        handleQuickCreateSociete
    };
}
