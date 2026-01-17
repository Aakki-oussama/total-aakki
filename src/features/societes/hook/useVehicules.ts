
import { useMemo } from 'react';
import type { Vehicule } from '@/types/tables';
import { vehiculeService } from '../services/vehiculeService';
import { useServerResource } from '@/lib/hooks/useServerResource';

type VehiculeWithSociete = Vehicule & { societe: { nom_societe: string } };

/**
 * HOOK: useVehicules
 * Gère la logique métier pour les véhicules de la flotte.
 */
export function useVehicules(societeId?: string, enabled: boolean = true) {
    const extraArgs = useMemo(() => [societeId], [societeId]);

    const {
        items,
        totalCount: totalVehicules,
        loading,
        error,
        isSubmitting,
        pagination,
        filters,
        modals,
        handleFormSubmit: genericSubmit,
        handleDelete: genericDelete
    } = useServerResource<VehiculeWithSociete>(
        vehiculeService.fetchVehicules,
        { entityName: 'Véhicule', enabled },
        extraArgs
    );

    const handleFormSubmit = async (formData: Omit<Vehicule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        const submitFn = modals.selectedItem
            ? (data: typeof formData) => vehiculeService.updateVehicule((modals.selectedItem as Vehicule).id, data) as Promise<VehiculeWithSociete>
            : (data: typeof formData) => vehiculeService.createVehicule(data) as Promise<VehiculeWithSociete>;

        await genericSubmit(submitFn, formData);
    };

    const handleDeleteConfirm = async () => {
        await genericDelete(vehiculeService.deleteVehicule);
    };

    return {
        vehicules: items,
        totalVehicules,
        loading,
        error,
        isSubmitting,

        // Pagination
        currentPage: pagination.currentPage,
        perPage: pagination.perPage,
        totalPages: pagination.totalPages,
        setCurrentPage: pagination.setCurrentPage,
        setPerPage: pagination.setPerPage,

        // Filtres
        searchTerm: filters.searchTerm,
        setSearchTerm: filters.setSearchTerm,
        selectedDate: filters.selectedDate,
        setSelectedDate: filters.setSelectedDate,

        // Modals & Handlers
        isFormModalOpen: modals.isFormOpen,
        isDeleteModalOpen: modals.isDeleteOpen,
        selectedVehicule: modals.selectedItem,
        openCreateModal: modals.openCreate,
        openEditModal: modals.openEdit,
        openDeleteModal: modals.openDelete,
        closeModals: modals.closeAll,
        handleFormSubmit,
        handleDeleteConfirm
    };
}
