
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/context';
import { useCrudModals } from './useCrudModals';
import { useDebounce } from './useDebounce';
import { mapSupabaseError } from '@/lib/supabase/error-handler';

interface FetchResponse<T> {
    items: T[];
    totalCount: number;
}

// 🔧 FIX: Add generic TArgs for typesafe extra arguments
type FetchFunction<T, TArgs extends unknown[] = []> = (
    page: number,
    perPage: number,
    searchTerm: string,
    dateFilter: string,
    ...args: TArgs
) => Promise<FetchResponse<T>>;

interface UseServerResourceOptions {
    initialPerPage?: number;
    entityName?: string;
    onSuccessMessage?: string;
    onCreateMessage?: string;
    onUpdateMessage?: string;
    onDeleteMessage?: string;
    enabled?: boolean; // Performance : Lazy loading
}

/**
 * HOOK: useServerResource (Expert Edition)
 * Centralise : Pagination, Recherche (Debounce), Date, CRUD Modals, Lazy Loading et Optimistic Updates.
 */
export function useServerResource<T extends { id?: string }, TArgs extends unknown[] = []>(
    fetchFn: FetchFunction<T, TArgs>,
    options: UseServerResourceOptions = {},
    extraFetchArgs: TArgs = [] as unknown as TArgs
) {
    const {
        initialPerPage = 10,
        entityName = 'élément',
        onSuccessMessage,
        onCreateMessage = `${entityName} enregistré avec succès`,
        onUpdateMessage = `${entityName} mis à jour avec succès`,
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

    // 🔧 FIX: Use ref to store extraFetchArgs to avoid dependency array issues
    // This prevents infinite re-renders when extraFetchArgs array reference changes
    const extraFetchArgsRef = useRef(extraFetchArgs);

    // 🔧 FIX: Use ref to store fetchFn to prevent infinite re-render loops
    // This is the CRITICAL fix that prevents 15,681 queries per user!
    const fetchFnRef = useRef(fetchFn);

    // Update refs when values change (silently, without triggering re-renders)
    useEffect(() => {
        extraFetchArgsRef.current = extraFetchArgs;
        fetchFnRef.current = fetchFn;
    }, [extraFetchArgs, fetchFn]);

    /**
     * Data Loading
     */
    const loadData = useCallback(async () => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);

            // 🔧 FIX: Use fetchFnRef.current instead of fetchFn directly
            // This prevents the infinite loop: fetchFn changes → loadData changes → useEffect runs → repeat
            const { items, totalCount: count } = await fetchFnRef.current(
                currentPage,
                perPage,
                debouncedSearchTerm,
                selectedDate,
                ...extraFetchArgsRef.current  // 🔧 FIX: Use ref value
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
    }, [enabled, currentPage, perPage, debouncedSearchTerm, selectedDate, toastError]);  // 🔧 CRITICAL FIX: Removed fetchFn from dependency array!

    // 🔧 FIX: Reset to page 1 ONLY when filters change (not on every render)
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, perPage, selectedDate]);

    // Load data when any parameter changes
    useEffect(() => {
        loadData();
    }, [currentPage, debouncedSearchTerm, perPage, selectedDate, loadData]);

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

            // Show specific message or fallback to successMessage
            const finalMessage = isEditing
                ? (onUpdateMessage || onSuccessMessage)
                : (onCreateMessage || onSuccessMessage);

            if (finalMessage) success(finalMessage);

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

    const handleDelete = async (deleteFn: (id: string) => Promise<void>) => {
        if (!modals.selectedItem?.id) return;

        // 🔧 FIX: Store both data AND totalCount for proper rollback
        const backupData = [...data];
        const backupTotalCount = totalCount;  // Store the actual total count
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
            // 🔧 FIX: ROLLBACK - Restore both data and the correct total count
            setData(backupData);
            setTotalCount(backupTotalCount);  // Restore actual total, not page length
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
