
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ResourceTitleContextType {
    titles: Record<string, string>;
    setResourceTitle: (id: string, title: string) => void;
}

const ResourceTitleContext = createContext<ResourceTitleContextType | undefined>(undefined);

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

export const useResourceTitle = () => {
    const context = useContext(ResourceTitleContext);
    if (!context) {
        throw new Error('useResourceTitle must be used within a ResourceTitleProvider');
    }
    return context;
};
