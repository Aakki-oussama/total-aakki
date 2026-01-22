import { useState, useMemo } from 'react';
import { useClients } from '@/features/clients/hook/useClients';
import { useSocietes } from '@/features/societes/hook/useSocietes';
import type { Gasoil } from '@/types/tables';
import type { GasoilWithDetails } from '../services/gasoilService';

interface UseGasoilFormProps {
    initialData?: GasoilWithDetails | null;
    onClose: () => void;
    onSubmit: (data: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
}

/**
 * HOOK: useGasoilForm
 * Gère l'état simplifié du formulaire Gasoil :
 * - Bascule entre Client et Société uniquement
 */
export function useGasoilForm({ initialData, onClose, onSubmit }: UseGasoilFormProps) {
    // 1. ÉTAT DE BASE
    const [type, setType] = useState<'CLIENT' | 'SOCIETE'>(
        initialData?.societe_id ? 'SOCIETE' : 'CLIENT'
    );
    const [entityId, setEntityId] = useState(
        initialData?.client_id || initialData?.societe_id || ''
    );
    const [montant, setMontant] = useState(initialData?.montant?.toString() || '');
    const [dateGasoil, setDateGasoil] = useState(
        initialData?.date_gasoil?.split('T')[0] || new Date().toISOString().split('T')[0]
    );

    // 2. FETCH DATA (LISTES PRINCIPALES)
    const { clients, loading: loadingClients } = useClients();
    const { societes, loading: loadingSocietes } = useSocietes();

    // 3. PRÉPARATION DES OPTIONS
    const entityOptions = useMemo(() => {
        if (type === 'CLIENT') {
            return clients.map(c => ({ value: c.id, label: `${c.nom} ${c.prenom}` }));
        }
        return societes.map(s => ({ value: s.id, label: s.nom_societe }));
    }, [type, clients, societes]);

    // 4. HANDLERS
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numericMontant = Number(montant);
        if (numericMontant <= 0) {
            alert("Le montant doit être supérieur à 0");
            return;
        }

        try {
            const payload: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> = {
                montant: numericMontant,
                date_gasoil: dateGasoil,
                client_id: type === 'CLIENT' ? (entityId || null) : null,
                societe_id: type === 'SOCIETE' ? (entityId || null) : null,
            };

            await onSubmit(payload);
            onClose();
        } catch (error) {
            console.error('Erreur soumission formulaire:', error);
            throw error;
        }
    };

    return {
        type,
        setType,
        entityId,
        setEntityId,
        montant,
        setMontant,
        dateGasoil,
        setDateGasoil,
        entityOptions,
        loadingEntities: type === 'CLIENT' ? loadingClients : loadingSocietes,
        handleSubmit
    };
}
