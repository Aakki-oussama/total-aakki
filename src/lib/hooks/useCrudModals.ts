import { useState, useCallback } from 'react';

/**
 * HOOK: useCrudModals
 * Un hook générique pour gérer l'état des modals dans n'importe quel CRUD.
 * T représente le type de l'objet (Client, Societe, etc.)
 */
export function useCrudModals<T>() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const openCreate = useCallback(() => {
        setSelectedItem(null);
        setIsFormOpen(true);
    }, []);

    const openEdit = useCallback((item: T) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    }, []);

    const openDelete = useCallback((item: T) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    }, []);

    const closeAll = useCallback(() => {
        setIsFormOpen(false);
        setIsDeleteOpen(false);
        setSelectedItem(null);
    }, []);

    return {
        isFormOpen,
        isDeleteOpen,
        selectedItem,
        openCreate,
        openEdit,
        openDelete,
        closeAll,
    };
}
