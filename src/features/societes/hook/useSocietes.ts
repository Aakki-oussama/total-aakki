
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
     * Handlers CRUD avec logique spécifique (Triple-Action)
     */
    const handleFormSubmit = async (formData: any) => {
        // En édition, on ne modifie que le nom. En création, on utilise le triple-action.
        const submitFn = modals.selectedItem
            ? (data: { nom_societe: string }) => societeService.updateSociete((modals.selectedItem as Societe).id, data)
            : (data: Parameters<typeof societeService.createSocieteComplete>[0]) => societeService.createSocieteComplete(data);

        await genericSubmit(submitFn as any, formData); // On garde un petit cast ici car les deux signatures divergent trop pour la soumission générique
    };

    const handleDeleteConfirm = async () => {
        await genericDelete(societeService.deleteSociete);
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
