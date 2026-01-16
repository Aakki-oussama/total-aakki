import { useState, useMemo } from 'react';

/**
 * GENERIC PAGINATION HOOK
 * Manages slicing of a dataset and pagination state.
 */
export function usePagination<T>(data: T[], initialPerPage: number = 10) {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(initialPerPage);

    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    // Reset to page 1 if data changes or filters applied
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;

        // Safety check: if current page is out of bounds after filtering
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }

        return data.slice(start, end);
    }, [data, currentPage, perPage, totalPages]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of table/page for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    return {
        currentPage,
        perPage,
        totalPages,
        totalItems,
        paginatedData,
        setCurrentPage: handlePageChange,
        setPerPage: handlePerPageChange
    };
}
