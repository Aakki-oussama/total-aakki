import { useState, useMemo } from 'react';

/**
 * HOOK: useDateFilter
 * Gère le filtrage par date d'une liste de données.
 * @param data La liste des données à filtrer
 * @param dateKey La clé de l'objet contenant la date (ex: 'created_at')
 */
export function useDateFilter<T>(data: T[], dateKey: keyof T) {
    const [selectedDate, setSelectedDate] = useState('');

    const filteredData = useMemo(() => {
        if (!selectedDate) return data;

        return data.filter((item) => {
            const itemDate = item[dateKey];
            if (!itemDate) return false;

            // Comparaison simplifiée au format YYYY-MM-DD
            try {
                const formattedItemDate = new Date(String(itemDate)).toISOString().split('T')[0];
                return formattedItemDate === selectedDate;
            } catch (e) {
                console.error("Erreur de format de date pour le filtrage:", e);
                return false;
            }
        });
    }, [data, selectedDate, dateKey]);

    return {
        selectedDate,
        setSelectedDate,
        filteredData
    };
}
