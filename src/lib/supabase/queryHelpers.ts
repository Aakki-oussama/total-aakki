
/**
 * Apply date filter to a Supabase query
 * Filters by created_at between 00:00:00 and 23:59:59 of the given date
 */
// 🔧 FIX: Use 'any' for query builder to avoid complex generic type mismatches and infinite recursion errors
export const applyDateFilter = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    dateFilter: string,
    column: string = 'created_at'
) => {
    if (!dateFilter?.trim()) return query;

    const startOfDay = `${dateFilter}T00:00:00`;
    const endOfDay = `${dateFilter}T23:59:59`;

    return query.gte(column, startOfDay).lte(column, endOfDay);
};

/**
 * Calculate pagination range
 */
export const getPaginationRange = (page: number, perPage: number) => {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    return { start, end };
};
