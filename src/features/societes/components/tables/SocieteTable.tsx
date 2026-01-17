import { useMemo } from 'react';
import { TableActions, DataTable } from '@/components/shared/ui';
import type { Societe } from '@/types/tables';

interface SocieteTableProps {
    societes: Societe[];
    loading: boolean;
    onView: (societe: Societe) => void;
    onEdit: (societe: Societe) => void;
    onDelete: (societe: Societe) => void;
}

/**
 * COMPONENT: SocieteTable
 * Tableau standardisé utilisant TableActions pour la cohérence UI.
 */
export default function SocieteTable({
    societes,
    loading,
    onView,
    onEdit,
    onDelete
}: SocieteTableProps) {
    const columns = useMemo(() => [
        {
            header: 'Nom de la Société',
            render: (societe: Societe) => (
                <span className="font-bold text-main">{societe.nom_societe}</span>
            )
        },
        {
            header: 'Date de Création',
            render: (societe: Societe) => {
                const date = new Date(societe.created_at || '');
                return (
                    <span className="text-muted font-medium">
                        {date.toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (societe: Societe) => (
                <TableActions
                    onView={() => onView(societe)}
                    onEdit={() => onEdit(societe)}
                    onDelete={() => onDelete(societe)}
                    viewLabel="Voir Profil"
                />
            )
        }
    ], [onView, onEdit, onDelete]);

    return (
        <DataTable
            data={societes}
            columns={columns}
            loading={loading}
            emptyState={
                <div className="py-20 text-center">
                    <p className="text-muted font-medium">Aucune société trouvée.</p>
                </div>
            }
        />
    );
}
