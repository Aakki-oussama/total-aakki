
import { useMemo } from 'react';
import type { Employe } from '@/types/tables';
import { employeService } from '../services/employeService';
import { useServerResource } from '@/lib/hooks/useServerResource';

type EmployeWithSociete = Employe & { societe: { nom_societe: string } };

/**
 * HOOK: useEmployes
 * Gère la logique métier pour les employés (chauffeurs).
 * Supporte le filtrage optionnel par société.
 */
export function useEmployes(societeId?: string, enabled: boolean = true) {
    // On mémoïse les arguments supplémentaires pour éviter des re-chargements infinis
    const extraArgs = useMemo(() => [societeId], [societeId]);

    const {
        items,
        totalCount: totalEmployes,
        loading,
        error,
        isSubmitting,
        pagination,
        filters,
        modals,
        handleFormSubmit: genericSubmit,
        handleDelete: genericDelete
    } = useServerResource<EmployeWithSociete>(
        employeService.fetchEmployes,
        { entityName: 'Chauffeur', enabled },
        extraArgs
    );

    const handleFormSubmit = async (formData: Omit<Employe, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        const submitFn = modals.selectedItem
            ? (data: typeof formData) => employeService.updateEmploye((modals.selectedItem as Employe).id, data) as Promise<EmployeWithSociete>
            : (data: typeof formData) => employeService.createEmploye(data) as Promise<EmployeWithSociete>;

        await genericSubmit(submitFn, formData);
    };

    const handleDeleteConfirm = async () => {
        await genericDelete(employeService.deleteEmploye);
    };

    return {
        employes: items,
        totalEmployes,
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
        selectedEmploye: modals.selectedItem,
        openCreateModal: modals.openCreate,
        openEditModal: modals.openEdit,
        openDeleteModal: modals.openDelete,
        closeModals: modals.closeAll,
        handleFormSubmit,
        handleDeleteConfirm
    };
}
