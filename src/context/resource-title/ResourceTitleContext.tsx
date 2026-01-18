
import { useState, type ReactNode } from 'react';
import { ResourceTitleContext } from './useResourceTitle';

export const ResourceTitleProvider = ({ children }: { children: ReactNode }) => {
    const [titles, setTitles] = useState<Record<string, string>>({});

    const setResourceTitle = (id: string, title: string) => {
        setTitles(prev => ({ ...prev, [id]: title }));
    };

    return (
        <ResourceTitleContext.Provider value={{ titles, setResourceTitle }}>
            {children}
        </ResourceTitleContext.Provider>
    );
};
