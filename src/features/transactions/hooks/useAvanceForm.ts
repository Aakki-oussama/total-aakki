import { useState, useMemo } from 'react';
import { useClients } from '@/features/clients/hook/useClients';
import { useSocietes } from '@/features/societes/hook/useSocietes';
import type { Avance } from '@/types/tables';
import type { AvanceWithDetails } from '../services/avanceService';

interface UseAvanceFormProps {
    initialData?: AvanceWithDetails | null;
    onClose: () => void;
    onSubmit: (data: Omit<Avance, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    onQuickCreateClient: (data: { nom: string; prenom: string; montant: number }) => Promise<void>;
    onQuickCreateSociete: (data: { nom_societe: string; montant: number }) => Promise<void>;
}

/**
 * HOOK: useAvanceForm
 * Manages the complex state and logic for the AvanceForm component.
 * Separates concerns: Logic here, UI in the component.
 */
export function useAvanceForm({
    initialData,
    onClose,
    onSubmit,
    onQuickCreateClient,
    onQuickCreateSociete
}: UseAvanceFormProps) {
    // 1. STATE INITIALIZATION (Calculated directly from initialData)
    const [type, setType] = useState<'CLIENT' | 'SOCIETE'>(
        initialData?.societe_id ? 'SOCIETE' : 'CLIENT'
    );
    const [isNewEntity, setIsNewEntity] = useState(false);

    const [entityId, setEntityId] = useState(
        initialData?.client_id || initialData?.societe_id || ''
    );
    const [montant, setMontant] = useState(
        initialData?.montant?.toString() || ''
    );
    const [modePaiement, setModePaiement] = useState<'CASH' | 'CHEQUE'>(
        initialData?.mode_paiement || 'CASH'
    );
    const [numeroCheque, setNumeroCheque] = useState(
        initialData?.numero_cheque || ''
    );
    const [dateAvance, setDateAvance] = useState(
        initialData?.date_avance?.split('T')[0] || new Date().toISOString().split('T')[0]
    );

    // Fields for "New" mode
    const [newNom, setNewNom] = useState('');
    const [newPrenom, setNewPrenom] = useState('');
    const [newNomSociete, setNewNomSociete] = useState('');

    // 2. FETCH DATA
    const { clients, loading: loadingClients } = useClients();
    const { societes, loading: loadingSocietes } = useSocietes();

    // 3. EFFECT REMOVED (No longer needed, state is initialized correctly)

    // 4. PREPARE OPTIONS
    const entityOptions = useMemo(() => {
        if (type === 'CLIENT') {
            return clients.map(c => ({ value: c.id, label: `${c.nom} ${c.prenom}` }));
        }
        return societes.map(s => ({ value: s.id, label: s.nom_societe }));
    }, [type, clients, societes]);

    // 5. HANDLERS
    const resetForm = () => {
        setIsNewEntity(false);
        setEntityId('');
        setMontant('');
        setNumeroCheque('');
        setNewNom('');
        setNewPrenom('');
        setNewNomSociete('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numericMontant = Number(montant);
        if (numericMontant <= 0) {
            alert("Le montant doit être supérieur à 0");
            return;
        }

        try {
            if (isNewEntity) {
                if (type === 'CLIENT') {
                    await onQuickCreateClient({ nom: newNom, prenom: newPrenom, montant: numericMontant });
                } else {
                    await onQuickCreateSociete({ nom_societe: newNomSociete, montant: numericMontant });
                }
            } else {
                const payload: Omit<Avance, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> = {
                    montant: numericMontant,
                    mode_paiement: modePaiement,
                    numero_cheque: modePaiement === 'CHEQUE' ? numeroCheque : null,
                    date_avance: dateAvance,
                    client_id: type === 'CLIENT' ? (entityId || null) : null,
                    societe_id: type === 'SOCIETE' ? (entityId || null) : null,
                };
                await onSubmit(payload);
            }
            onClose();
            resetForm();
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    };

    return {
        // Form values
        type,
        setType,
        isNewEntity,
        setIsNewEntity,
        entityId,
        setEntityId,
        montant,
        setMontant,
        modePaiement,
        setModePaiement,
        numeroCheque,
        setNumeroCheque,
        dateAvance,
        setDateAvance,
        newNom,
        setNewNom,
        newPrenom,
        setNewPrenom,
        newNomSociete,
        setNewNomSociete,

        // Computed / External
        entityOptions,
        loadingEntities: type === 'CLIENT' ? loadingClients : loadingSocietes,

        // Handlers
        handleSubmit,
        resetForm
    };
}
