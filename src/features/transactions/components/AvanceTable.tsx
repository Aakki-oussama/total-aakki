import { useMemo } from 'react';
import { DataTable, TableActions, Badge } from '@/components/shared/ui';
import type { AvanceWithDetails } from '../services/avanceService';
import { User, Building2 } from 'lucide-react';
import { iconConfig } from '@/config/icons';

interface AvanceTableProps {
    avances: AvanceWithDetails[];
    loading: boolean;
    onEdit: (avance: AvanceWithDetails) => void;
    onDelete: (avance: AvanceWithDetails) => void;
}

/**
 * COMPONENT: AvanceTable
 * Displays the list of payments (avances) with styled columns.
 */
export default function AvanceTable({
    avances,
    loading,
    onEdit,
    onDelete
}: AvanceTableProps) {
    const columns = useMemo(() => [
        {
            header: 'Date',
            render: (avance: AvanceWithDetails) => (
                <span className="text-muted font-medium">
                    {new Date(avance.date_avance).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            )
        },
        {
            header: 'Entité',
            render: (avance: AvanceWithDetails) => {
                const isClient = !!avance.client;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isClient ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                            {isClient
                                ? <User className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                                : <Building2 className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                            }
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-main">
                                {isClient
                                    ? `${avance.client?.nom} ${avance.client?.prenom}`
                                    : avance.societe?.nom_societe}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
                                {isClient ? 'Client' : 'Société'}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Montant',
            className: 'font-mono',
            render: (avance: AvanceWithDetails) => (
                <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    {Number(avance.montant).toLocaleString('fr-FR')} DH
                </span>
            )
        },
        {
            header: 'Mode',
            render: (avance: AvanceWithDetails) => (
                <Badge
                    variant={avance.mode_paiement === 'CHEQUE' ? 'info' : 'success'}
                    size="sm"
                    dot
                >
                    {avance.mode_paiement}
                </Badge>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (avance: AvanceWithDetails) => (
                <TableActions
                    onEdit={() => onEdit(avance)}
                    onDelete={() => onDelete(avance)}
                />
            )
        }
    ], [onEdit, onDelete]);

    return (
        <DataTable
            data={avances}
            columns={columns}
            loading={loading}
            emptyState={
                <div className="py-20 text-center">
                    <p className="text-muted font-medium">Aucun paiement trouvé.</p>
                </div>
            }
        />
    );
}
