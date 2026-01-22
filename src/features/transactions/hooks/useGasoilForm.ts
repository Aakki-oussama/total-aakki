import { useState, useMemo, useEffect } from 'react';
import { useClients } from '@/features/clients/hook/useClients';
import { useSocietes } from '@/features/societes/hook/useSocietes';
import { employeService } from '@/features/societes/services/employeService';
import { vehiculeService } from '@/features/societes/services/vehiculeService';
import type { Gasoil } from '@/types/tables';
import type { GasoilWithDetails } from '../services/gasoilService';

interface UseGasoilFormProps {
    initialData?: GasoilWithDetails | null;
    onClose: () => void;
    onSubmit: (data: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
}

/**
 * HOOK: useGasoilForm
 * Gère l'état complexe du formulaire Gasoil :
 * - Bascule entre Client et Société
 * - Chargement dynamique des chauffeurs/véhicules si Société sélectionnée
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

    // ÉTATS SPÉCIFIQUES SOCIÉTÉ
    const [employeId, setEmployeId] = useState(initialData?.employe_id || '');
    const [vehiculeId, setVehiculeId] = useState(initialData?.vehicule_id || '');

    // Listes dynamiques pour sociétés
    const [employes, setEmployes] = useState<{ id: string, nom: string, prenom: string }[]>([]);
    const [vehicules, setVehicules] = useState<{ id: string, matricule: string }[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // 2. FETCH DATA (LISTES PRINCIPALES)
    const { clients, loading: loadingClients } = useClients();
    const { societes, loading: loadingSocietes } = useSocietes();

    // 3. CHARGEMENT DYNAMIQUE (DÉTAILS SOCIÉTÉ)
    useEffect(() => {
        if (type === 'SOCIETE' && entityId) {
            const fetchSocieteDetails = async () => {
                setLoadingDetails(true);
                try {
                    const [empRes, vehRes] = await Promise.all([
                        employeService.fetchEmployes(1, 100, '', '', entityId),
                        vehiculeService.fetchVehicules(1, 100, '', '', entityId)
                    ]);
                    setEmployes(empRes.items);
                    setVehicules(vehRes.items);
                } catch (error) {
                    console.error('Erreur lors du chargement des détails société:', error);
                } finally {
                    setLoadingDetails(false);
                }
            };
            fetchSocieteDetails();
        } else {
            setEmployes([]);
            setVehicules([]);
        }
    }, [type, entityId]);

    // 4. PRÉPARATION DES OPTIONS POUR LES SELECTS
    const entityOptions = useMemo(() => {
        if (type === 'CLIENT') {
            return clients.map(c => ({ value: c.id, label: `${c.nom} ${c.prenom}` }));
        }
        return societes.map(s => ({ value: s.id, label: s.nom_societe }));
    }, [type, clients, societes]);

    const employeOptions = useMemo(() =>
        employes.map(e => ({ value: e.id, label: `${e.nom} ${e.prenom}` }))
        , [employes]);

    const vehiculeOptions = useMemo(() =>
        vehicules.map(v => ({ value: v.id, label: v.matricule }))
        , [vehicules]);

    // 5. HANDLERS
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
                employe_id: type === 'SOCIETE' ? (employeId || null) : null,
                vehicule_id: type === 'SOCIETE' ? (vehiculeId || null) : null,
            };

            await onSubmit(payload);
            onClose();
        } catch (error) {
            console.error('Erreur soumission formulaire:', error);
            throw error;
        }
    };

    return {
        // État
        type,
        setType,
        entityId,
        setEntityId,
        montant,
        setMontant,
        dateGasoil,
        setDateGasoil,
        employeId,
        setEmployeId,
        vehiculeId,
        setVehiculeId,

        // Options & Loading
        entityOptions,
        employeOptions,
        vehiculeOptions,
        loadingEntities: type === 'CLIENT' ? loadingClients : loadingSocietes,
        loadingDetails,

        // Handlers
        handleSubmit
    };
}
