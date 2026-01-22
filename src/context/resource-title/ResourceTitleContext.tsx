import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { ResourceTitleContext } from './useResourceTitle';

export const ResourceTitleProvider = ({ children }: { children: ReactNode }) => {
    const [titles, setTitles] = useState<Record<string, string>>({});

    const setResourceTitle = useCallback((id: string, title: string) => {
        setTitles(prev => {
            if (prev[id] === title) return prev; // Éviter l'update si identique
            return { ...prev, [id]: title };
        });
    }, []);

    const value = useMemo(() => ({ titles, setResourceTitle }), [titles, setResourceTitle]);

    return (
        <ResourceTitleContext.Provider value={value}>
            {children}
        </ResourceTitleContext.Provider>
    );
};
