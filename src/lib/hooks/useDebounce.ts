import { useState, useEffect } from 'react';

/**
 * HOOK: useDebounce
 * Retarde la mise à jour d'une valeur jusqu'à ce que l'utilisateur arrête de taper.
 * 
 * @param value - La valeur à "debouncer" (ex: terme de recherche)
 * @param delay - Délai en millisecondes (défaut: 300ms)
 * @returns La valeur "debouncée"
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * // debouncedSearch ne change que 500ms après la dernière frappe
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Créer un timer qui met à jour la valeur après le délai
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Nettoyer le timer si la valeur change avant la fin du délai
        // Cela "annule" le timer précédent et en crée un nouveau
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
