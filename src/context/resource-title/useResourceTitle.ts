import { createContext, useContext } from 'react';

export interface ResourceTitleContextType {
    titles: Record<string, string>;
    setResourceTitle: (id: string, title: string) => void;
}

export const ResourceTitleContext = createContext<ResourceTitleContextType | undefined>(undefined);

export const useResourceTitle = () => {
    const context = useContext(ResourceTitleContext);
    if (!context) {
        throw new Error('useResourceTitle must be used within a ResourceTitleProvider');
    }
    return context;
};
