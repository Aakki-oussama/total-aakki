import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/types/views';
import { societeService } from '../services/societeService';
import { useToast } from '@/context/toast/useToast';

export function useSocieteHistory(societeId: string | undefined) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const { error: toastError } = useToast();

    const fetchHistory = useCallback(async () => {
        if (!societeId) return;
        try {
            setLoading(true);
            const { items, totalCount } = await societeService.getSocieteHistory(
                societeId,
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
    }, [societeId, page, perPage, searchTerm, dateFilter, toastError]);

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
