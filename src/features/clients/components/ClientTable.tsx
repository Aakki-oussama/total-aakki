import { useMemo } from 'react';
import type { Client } from '@/types/tables';
import { DataTable, TableActions } from '@/components/shared/ui';

interface ClientTableProps<T extends Client = Client> {
    clients: T[];
    loading: boolean;
    onEdit: (client: T) => void;
    onDelete: (client: T) => void;
    onView?: (client: T) => void;
}

interface ClientWithSolde extends Client {
    solde_actuel?: number;
}

export default function ClientTable<T extends Client>({
    clients,
    loading,
    onEdit,
    onDelete,
    onView
}: ClientTableProps<T>) {
    const columns = useMemo(() => [
        {
            header: 'Client',
            render: (client: T) => (
                <div className="flex flex-col">
                    <span className="font-bold text-main">{client.nom} {client.prenom}</span>
                </div>
            )
        },
        {
            header: 'Solde',
            render: (client: T) => {
                // Strict typing: Cast to extended interface
                const clientData = client as unknown as ClientWithSolde;
                const solde = clientData.solde_actuel || 0;
                const colorClass = solde < 0 ? 'text-red-600' : 'text-emerald-600';

                return (
                    <span className={`font-bold ${colorClass}`}>
                        {solde.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                    </span>
                );
            }
        },
        {
            header: 'Date d\'ajout',
            render: (client: T) => (
                <span className="text-muted font-medium">
                    {new Date(client.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (client: T) => (
                <TableActions
                    onEdit={() => onEdit(client)}
                    onDelete={() => onDelete(client)}
                    onView={onView ? () => onView(client) : undefined}
                />
            )
        }
    ], [onEdit, onDelete, onView]);

    return (
        <DataTable
            data={clients}
            columns={columns}
            loading={loading}
            emptyState={
                <div className="py-20 text-center">
                    <p className="text-muted font-medium">Aucun client trouvé.</p>
                </div>
            }
        />
    );
}
