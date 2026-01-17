
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context';
import { useCrudModals } from './useCrudModals';
import { useDebounce } from './useDebounce';
import { mapSupabaseError } from '@/lib/supabase/error-handler';

interface FetchResponse<T> {
    items: T[];
    totalCount: number;
}

type FetchFunction<T> = (
    page: number,
    perPage: number,
    searchTerm: string,
    dateFilter: string,
    ...args: any[]
) => Promise<FetchResponse<T>>;

interface UseServerResourceOptions {
    initialPerPage?: number;
    entityName?: string;
    onSuccessMessage?: string;
    onDeleteMessage?: string;
    enabled?: boolean; // Performance : Lazy loading
}

/**
 * HOOK: useServerResource (Expert Edition)
 * Centralise : Pagination, Recherche (Debounce), Date, CRUD Modals, Lazy Loading et Optimistic Updates.
 */
export function useServerResource<T extends { id?: string }>(
    fetchFn: FetchFunction<T>,
    options: UseServerResourceOptions = {},
    extraFetchArgs: any[] = []
) {
    const {
        initialPerPage = 10,
        entityName = 'élément',
        onSuccessMessage = `${entityName} mis à jour avec succès`,
        onDeleteMessage = `${entityName} supprimé avec succès`,
        enabled = true
    } = options;

    const { success, error: toastError } = useToast();
    const modals = useCrudModals<T>();

    // States
    const [data, setData] = useState<T[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [selectedDate, setSelectedDate] = useState('');

    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    /**
     * Data Loading
     */
    const loadData = useCallback(async () => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);

            const { items, totalCount: count } = await fetchFn(
                currentPage,
                perPage,
                debouncedSearchTerm,
                selectedDate,
                ...extraFetchArgs
            );

            setData(items);
            setTotalCount(count);
        } catch (err) {
            const translatedMsg = mapSupabaseError(err);
            setError(translatedMsg);
            toastError(translatedMsg);
        } finally {
            setLoading(false);
        }
    }, [enabled, currentPage, perPage, debouncedSearchTerm, selectedDate, fetchFn, toastError, ...extraFetchArgs]);

    useEffect(() => {
        if (currentPage !== 1 && (debouncedSearchTerm || perPage || selectedDate)) {
            setCurrentPage(1);
            return;
        }
        loadData();
    }, [currentPage, perPage, debouncedSearchTerm, selectedDate, loadData]);

    /**
     * Handlers CRUD avec Optimistic Updates
     */
    const handleFormSubmit = async <FormData>(
        submitFn: (formData: FormData) => Promise<T>,
        formData: FormData
    ) => {
        const isEditing = !!modals.selectedItem;
        const backupData = [...data];

        try {
            setIsSubmitting(true);

            // OPTIMISTIC UPDATE: On met à jour l'interface avant la réponse du serveur
            if (isEditing && modals.selectedItem?.id) {
                setData(prev => prev.map(item =>
                    item.id === modals.selectedItem?.id ? { ...item, ...formData } : item
                ));
            }

            const result = await submitFn(formData);
            success(onSuccessMessage);

            // Re-sync with server for safety and counters
            await loadData();
            modals.closeAll();
            return result;
        } catch (err) {
            // ROLLBACK: En cas d'erreur, on remet les anciennes données
            setData(backupData);
            const translatedMsg = mapSupabaseError(err);
            toastError(translatedMsg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (deleteFn: (id: string) => Promise<any>) => {
        if (!modals.selectedItem?.id) return;
        const backupData = [...data];
        const targetId = modals.selectedItem.id;

        try {
            setIsSubmitting(true);

            // OPTIMISTIC DELETE
            setData(prev => prev.filter(item => item.id !== targetId));
            setTotalCount(prev => prev - 1);

            await deleteFn(targetId);
            success(onDeleteMessage);

            await loadData();
            modals.closeAll();
        } catch (err) {
            // ROLLBACK
            setData(backupData);
            setTotalCount(backupData.length);
            const translatedMsg = mapSupabaseError(err);
            toastError(translatedMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        items: data,
        totalCount,
        loading,
        error,
        isSubmitting,
        refresh: loadData,
        pagination: { currentPage, perPage, totalPages, setCurrentPage, setPerPage },
        filters: { searchTerm, setSearchTerm, selectedDate, setSelectedDate },
        modals,
        handleFormSubmit,
        handleDelete,
        setIsSubmitting
    };
}
