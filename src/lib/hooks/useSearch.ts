import { useState, useMemo } from 'react';

/**
 * HOOK: useSearch
 * Gère le filtrage instantané d'une liste de données en mémoire.
 * @param data La liste complète des données
 * @param searchKeys Les clés de l'objet sur lesquelles effectuer la recherche (ex: ['nom', 'prenom'])
 */
export function useSearch<T>(data: T[], searchKeys: (keyof T)[]) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();

        if (!query) return data;

        return data.filter((item) => {
            return searchKeys.some((key) => {
                const value = item[key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(query);
            });
        });
    }, [data, searchTerm, searchKeys]);

    return {
        searchTerm,
        setSearchTerm,
        filteredData
    };
}
