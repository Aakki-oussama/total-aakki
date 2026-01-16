import { useMemo } from 'react';
import type { Client } from '@/types/tables';
import { DataTable, TableActions } from '@/components/shared/ui';

interface ClientTableProps {
    clients: Client[];
    loading: boolean;
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

/**
 * COMPONENT: ClientTable
 */
export default function ClientTable({
    clients,
    loading,
    onEdit,
    onDelete
}: ClientTableProps) {
    const columns = useMemo(() => [
        {
            header: 'Client',
            render: (client: Client) => (
                <div className="flex flex-col">
                    <span className="font-bold text-main">{client.nom} {client.prenom}</span>
                </div>
            )
        },
        {
            header: 'Date d\'ajout',
            render: (client: Client) => (
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
            render: (client: Client) => (
                <TableActions
                    onEdit={() => onEdit(client)}
                    onDelete={() => onDelete(client)}
                    onView={() => console.log('Voir client', client.id)}
                />
            )
        }
    ], [onEdit, onDelete]);

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
