import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/types/views';
import { clientService } from '../services/clientService';
import { useToast } from '@/context/toast/useToast';

export function useClientHistory(clientId: string | undefined) {
    // States pour la data
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // States pour les filtres et pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const { error: toastError } = useToast();

    const fetchHistory = useCallback(async () => {
        if (!clientId) return;
        try {
            setLoading(true);
            const { items, totalCount } = await clientService.getClientHistory(
                clientId,
                page,
                perPage,
                searchTerm,
                dateFilter
            );
            setHistory(items);
            setTotalCount(totalCount);
        } catch (err) {
            console.error(err);
            toastError("Erreur lors du chargement de l'historique");
        } finally {
            setLoading(false);
        }
    }, [clientId, page, perPage, searchTerm, dateFilter, toastError]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return {
        history,
        totalCount,
        loading,
        page,
        perPage,
        searchTerm,
        dateFilter,
        totalPages: Math.ceil(totalCount / perPage),
        setPage,
        setPerPage,
        setSearchTerm,
        setDateFilter,
        refresh: fetchHistory
    };
}
