
import type { Societe } from '@/types/tables';
import { societeService } from '../services/societeService';
import { useServerResource } from '@/lib/hooks/useServerResource';

/**
 * HOOK: useSocietes
 * Gestion de la logique métier pour les sociétés.
 * Utilise le moteur générique useServerResource.
 */
export function useSocietes() {
    const {
        items: societes,
        totalCount: totalSocietes,
        loading,
        error,
        isSubmitting,
        pagination,
        filters,
        modals,
        handleFormSubmit: genericSubmit,
        handleDelete: genericDelete
    } = useServerResource<Societe>(
        societeService.fetchSocietes,
        { entityName: 'Société' }
    );

    /**
     * Handlers CRUD
     */
    const handleFormSubmit = async (formData: { nom_societe: string }) => {
        if (modals.selectedItem) {
            // EDIT MODE
            const updateFn = (data: { nom_societe: string }) =>
                societeService.updateSociete((modals.selectedItem as Societe).id, data);

            await genericSubmit(updateFn, formData);
        } else {
            // CREATE MODE
            const createFn = (data: { nom_societe: string }) =>
                societeService.createSociete(data);

            await genericSubmit(createFn, formData);
        }
    };

    const handleDeleteConfirm = async () => {
        // 🔧 FIX: Wrap to return void (genericDelete expects Promise<void>)
        await genericDelete(async (id) => {
            await societeService.deleteSociete(id);
        });
    };

    return {
        societes,
        totalSocietes,
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
        selectedSociete: modals.selectedItem,
        openCreateModal: modals.openCreate,
        openEditModal: modals.openEdit,
        openDeleteModal: modals.openDelete,
        closeModals: modals.closeAll,
        handleFormSubmit,
        handleDeleteConfirm
    };
}
