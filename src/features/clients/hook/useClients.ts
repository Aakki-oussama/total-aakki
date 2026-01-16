import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Client } from '@/types/tables';
import { clientService } from '../services/clientService';
import { useToast } from '@/context';
import { useCrudModals } from '@/lib/hooks/useCrudModals';
import { useSearch } from '@/lib/hooks/useSearch';
import { useDateFilter } from '@/lib/hooks/useDateFilter';
import { mapSupabaseError } from '@/lib/supabase/error-handler';

/**
 * HOOK: useClients
 * Centralise toute la logique métier pour la gestion des clients.
 * Gère le chargement, les actions CRUD et les états des modals.
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Filtrage par date (Avant la recherche)
    const { selectedDate, setSelectedDate, filteredData: dateFilteredClients } = useDateFilter(clients, 'created_at');

    // 2. Filtrage par recherche (Sur les résultats du filtre date)
    const searchKeys = useMemo(() => ['nom', 'prenom'] as (keyof Client)[], []);
    const { searchTerm, setSearchTerm, filteredData: filteredClients } = useSearch(dateFilteredClients, searchKeys);

    /**
     * Charger les données au montage
     */
    const loadClients = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await clientService.fetchClients();
            setClients(data);
        } catch (err) {
            const translatedMsg = mapSupabaseError(err);
            setError(translatedMsg);
            toastError(translatedMsg);
        } finally {
            setLoading(false);
        }
    }, [toastError]);

    useEffect(() => {
        loadClients();
    }, [loadClients]);



    /**
     * ACTIONS CRUD
     */
    const handleFormSubmit = async (formData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        try {
            setIsSubmitting(true);
            if (selectedClient) {
                // UPDATE
                await clientService.updateClient(selectedClient.id, formData);
                success('Client mis à jour avec succès');
            } else {
                // CREATE
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
            setError(translatedMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Data
        clients: filteredClients, // Liste filtrée
        totalClients: clients.length,
        loading,
        error,
        isSubmitting,

        // Modal State
        isFormModalOpen,
        isDeleteModalOpen,
        selectedClient,

        // Search & Filter
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,

        // Handlers
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        handleFormSubmit,
        handleDeleteConfirm,
        refresh: loadClients
    };
}
