import { useState, useEffect, useCallback } from 'react';
import type { Client } from '@/types/tables';
import { clientService } from '../services/clientService';
import { useToast } from '@/context';
import { useCrudModals } from '@/lib/hooks/useCrudModals';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { mapSupabaseError } from '@/lib/supabase/error-handler';

/**
 * HOOK: useClients
 * Centralise toute la logique métier avec pagination serveur.
 */
export function useClients() {
    const { success, error: toastError } = useToast();
    const {
        isFormOpen: isFormModalOpen,
        isDeleteOpen: isDeleteModalOpen,
        selectedItem: selectedClient,
        openCreate: openCreateModal,
        openEdit: openEditModal,
        openDelete: openDeleteModal,
        closeAll: closeModals
    } = useCrudModals<Client>();

    // États des données
    const [clients, setClients] = useState<Client[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Recherche avec debounce
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Filtre par date (server-side)
    const [selectedDate, setSelectedDate] = useState('');

    // Calculer le nombre total de pages
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    /**
     * Charger les données depuis Supabase avec pagination serveur
     */
    const loadClients = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { clients: data, totalCount: count } = await clientService.fetchClients(
                currentPage,
                perPage,
                debouncedSearchTerm,
                selectedDate
            );

            setClients(data);
            setTotalCount(count);
        } catch (err) {
            const translatedMsg = mapSupabaseError(err);
            setError(translatedMsg);
            toastError(translatedMsg);
        } finally {
            setLoading(false);
        }
    }, [currentPage, perPage, debouncedSearchTerm, selectedDate, toastError]);

    // Recharger quand page, perPage ou recherche change
    useEffect(() => {
        loadClients();
    }, [loadClients]);

    // Reset à la page 1 quand la recherche ou perPage change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, perPage, selectedDate]);

    /**
     * ACTIONS CRUD
     */
    const handleFormSubmit = async (formData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        try {
            setIsSubmitting(true);
            if (selectedClient) {
                await clientService.updateClient(selectedClient.id, formData);
                success('Client mis à jour avec succès');
            } else {
                await clientService.createClient(formData);
                success('Nouveau client créé avec succès');
            }
            await loadClients();
            closeModals();
        } catch (err) {
            const translatedMsg = mapSupabaseError(err);
            toastError(translatedMsg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedClient) return;
        try {
            setIsSubmitting(true);
            await clientService.deleteClient(selectedClient.id);
            success('Client supprimé avec succès');
            await loadClients();
            closeModals();
        } catch (err) {
            const translatedMsg = mapSupabaseError(err);
            toastError(translatedMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
    };

    return {
        // Data
        clients, // Données filtrées côté serveur
        totalClients: totalCount,
        loading,
        error,
        isSubmitting,

        // Pagination (Server-Side)
        currentPage,
        perPage,
        totalPages,
        setCurrentPage: handlePageChange,
        setPerPage: handlePerPageChange,

        // Search & Filter
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,

        // Handlers & Modals
        isFormModalOpen,
        isDeleteModalOpen,
        selectedClient,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        handleFormSubmit,
        handleDeleteConfirm,
        refresh: loadClients
    };
}
