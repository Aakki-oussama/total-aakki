import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

/**
 * HOOK: useSearch
 * Gère le filtrage d'une liste avec debounce pour optimiser les performances.
 * 
 * @param data - La liste complète des données
 * @param searchKeys - Les clés de l'objet sur lesquelles effectuer la recherche
 * @param debounceDelay - Délai de debounce en ms (défaut: 300ms)
 * 
 * @example
 * const { searchTerm, setSearchTerm, filteredData } = useSearch(
 *     clients, 
 *     ['nom', 'prenom'],
 *     300
 * );
 */
export function useSearch<T>(
    data: T[],
    searchKeys: (keyof T)[],
    debounceDelay: number = 300
) {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce: Le filtre ne s'exécute que 300ms après la dernière frappe
    const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

    const filteredData = useMemo(() => {
        const query = debouncedSearchTerm.toLowerCase().trim();

        if (!query) return data;

        return data.filter((item) => {
            return searchKeys.some((key) => {
                const value = item[key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(query);
            });
        });
    }, [data, debouncedSearchTerm, searchKeys]);

    return {
        searchTerm,          // Valeur immédiate (pour l'input)
        setSearchTerm,
        filteredData,        // Données filtrées (avec debounce)
        isSearching: searchTerm !== debouncedSearchTerm  // Indicateur de recherche en cours
    };
}
