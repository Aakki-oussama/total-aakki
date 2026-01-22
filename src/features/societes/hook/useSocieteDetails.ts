import { useState, useEffect, useCallback } from 'react';
import { societeService } from '../services/societeService';
import { useToast } from '@/context/toast/useToast';
import { useResourceTitle } from '@/context/resource-title/useResourceTitle';
import type { Societe } from '@/types/tables';

interface SocieteWithDetails extends Societe {
    total_transactions: number;
    solde: {
        solde_actuel: number;
        total_avances: number;
        total_gasoil: number;
    };
}

export function useSocieteDetails(societeId: string | undefined) {
    const [societe, setSociete] = useState<SocieteWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { error: toastError } = useToast();
    const { setResourceTitle } = useResourceTitle();

    const fetchDetails = useCallback(async () => {
        if (!societeId) return;
        try {
            setLoading(true);
            const data = await societeService.getSocieteById(societeId) as unknown as SocieteWithDetails;
            setSociete(data);

            if (data?.nom_societe) {
                setResourceTitle(societeId, data.nom_societe);
            }
        } catch (err) {
            console.error(err);
            toastError("Erreur lors du chargement des détails de la société");
        } finally {
            setLoading(false);
        }
    }, [societeId, setResourceTitle, toastError]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return {
        societe,
        loading,
        refresh: fetchDetails
    };
}
