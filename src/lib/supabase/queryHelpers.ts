import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Apply date filter to a Supabase query
 * Filters by date range (start to end) or a single day
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyDateFilter = <T extends PostgrestFilterBuilder<any, any, any, any, any, any, any>>(
    query: T,
    dateFilter: string,
    column: string = 'created_at'
): T => {
    if (!dateFilter?.trim()) return query;

    // Si on a une période (format "YYYY-MM-DD:YYYY-MM-DD")
    if (dateFilter.includes(':')) {
        const [start, end] = dateFilter.split(':');
        return query.gte(column, `${start}T00:00:00`).lte(column, `${end}T23:59:59`) as unknown as T;
    }

    // Sinon, filtre par jour unique
    const startOfDay = `${dateFilter}T00:00:00`;
    const endOfDay = `${dateFilter}T23:59:59`;

    return query.gte(column, startOfDay).lte(column, endOfDay) as unknown as T;
};

/**
 * Calculate pagination range
 */
export const getPaginationRange = (page: number, perPage: number) => {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    return { start, end };
};
