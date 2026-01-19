
import type { Client } from '@/types/tables';
import { clientService } from '../services/clientService';
import { useServerResource } from '@/lib/hooks/useServerResource';

/**
 * HOOK: useClients
 * Centralise toute la logique métier avec pagination serveur.
 * Utilise le moteur générique useServerResource.
 */
export function useClients() {
    const {
        items: clients,
        totalCount: totalClients,
        loading,
        error,
        isSubmitting,
        pagination,
        filters,
        modals,
        handleFormSubmit: genericSubmit,
        handleDelete: genericDelete
    } = useServerResource<Client>(
        clientService.fetchClients,
        { entityName: 'Client' }
    );

    /**
     * Spécificité pour la soumission du formulaire
     */
    const handleFormSubmit = async (formData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        const submitFn = modals.selectedItem
            ? (data: typeof formData) => clientService.updateClient((modals.selectedItem as Client).id, data)
            : clientService.createClient;

        await genericSubmit(submitFn, formData);
    };

    /**
     * Spécificité pour la suppression
     */
    const handleDeleteConfirm = async () => {
        await genericDelete(async (id) => {
            await clientService.deleteClient(id);
        });
    };

    return {
        // Data
        clients,
        totalClients,
        loading,
        error,
        isSubmitting,

        // Pagination
        currentPage: pagination.currentPage,
        perPage: pagination.perPage,
        totalPages: pagination.totalPages,
        setCurrentPage: pagination.setCurrentPage,
        setPerPage: pagination.setPerPage,

        // Filters
        searchTerm: filters.searchTerm,
        setSearchTerm: filters.setSearchTerm,
        selectedDate: filters.selectedDate,
        setSelectedDate: filters.setSelectedDate,

        // Modals & Handlers
        isFormModalOpen: modals.isFormOpen,
        isDeleteModalOpen: modals.isDeleteOpen,
        selectedClient: modals.selectedItem,
        openCreateModal: modals.openCreate,
        openEditModal: modals.openEdit,
        openDeleteModal: modals.openDelete,
        closeModals: modals.closeAll,
        handleFormSubmit,
        handleDeleteConfirm
    };
}
