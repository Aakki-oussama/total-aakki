
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
    // Define proper types for form data
    type CreatePayload = Parameters<typeof societeService.createSocieteComplete>[0];
    type UpdatePayload = { nom_societe: string };

    const handleFormSubmit = async (formData: CreatePayload | UpdatePayload) => {
        if (modals.selectedItem) {
            // EDIT MODE: Update only name
            const updateFn = (data: UpdatePayload) =>
                societeService.updateSociete((modals.selectedItem as Societe).id, data);

            // We need to narrow the type or cast specifically, avoiding 'any'
            // Since we know we are in edit mode, formData should conform to UpdatePayload
            await genericSubmit(updateFn, formData as UpdatePayload);
        } else {
            // CREATE MODE: Complete creation (Societe + Employes + Vehicules)
            const createFn = (data: CreatePayload) =>
                societeService.createSocieteComplete(data);

            await genericSubmit(createFn, formData as CreatePayload);
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
