import { useState, useEffect, useCallback } from 'react';
import { clientService } from '../services/clientService';
import { useToast } from '@/context/toast/useToast';
import { useResourceTitle } from '@/context/resource-title/useResourceTitle';
import type { Client } from '@/types/tables';

interface ClientWithDetails extends Client {
    total_transactions: number;
    solde: {
        solde_actuel: number;
        total_avances: number;
        total_gasoil: number;
    };
}

export function useClientDetails(clientId: string | undefined) {
    const [client, setClient] = useState<ClientWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { error: toastError } = useToast();
    const { setResourceTitle } = useResourceTitle();

    const fetchDetails = useCallback(async () => {
        if (!clientId) return;
        try {
            setLoading(true);
            const data = await clientService.getClientById(clientId) as unknown as ClientWithDetails;
            setClient(data);

            // Mise à jour du titre pour le fil d'Ariane (Breadcrumbs)
            if (data?.nom) {
                setResourceTitle(clientId, `${data.nom} ${data.prenom || ''}`);
            }
        } catch (err) {
            console.error(err);
            toastError("Erreur lors du chargement des détails du client");
        } finally {
            setLoading(false);
        }
    }, [clientId, setResourceTitle, toastError]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return {
        client,
        loading,
        refresh: fetchDetails
    };
}
