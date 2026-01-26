import { useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { TableActions, DataTable, EmptyState } from '@/components/shared/ui';
import type { Societe } from '@/types/tables';
import { formatCurrency, formatDateShort } from '@/lib/supabase/helpers';

interface SocieteTableProps {
    societes: Societe[];
    loading: boolean;
    onView: (societe: Societe) => void;
    onEdit: (societe: Societe) => void;
    onDelete: (societe: Societe) => void;
}

interface SocieteWithSolde extends Societe {
    solde_actuel?: number;
}

export default function SocieteTable({
    societes,
    loading,
    onView,
    onEdit,
    onDelete
}: SocieteTableProps) {
    const columns = useMemo(() => [
        {
            header: 'Société',
            render: (societe: Societe) => (
                <span className="font-bold text-main">{societe.nom_societe}</span>
            )
        },
        {
            header: 'Solde',
            render: (societe: Societe) => {
                const societeWithSolde = societe as unknown as SocieteWithSolde;
                const solde = societeWithSolde.solde_actuel || 0;
                const colorClass = solde < 0 ? 'text-danger' : 'text-success';

                return (
                    <span className={`font-bold ${colorClass}`}>
                        {formatCurrency(solde)}
                    </span>
                );
            }
        },
        {
            header: 'Crée le',
            render: (societe: Societe) => {
                return (
                    <span className="text-muted font-medium">
                        {formatDateShort(societe.created_at || '')}
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
                <EmptyState
                    icon={Building2}
                    title="Aucune société trouvée"
                    description="Votre recherche n'a retourné aucun profil de société."
                />
            }
        />
    );
}
