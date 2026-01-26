import { useMemo } from 'react';
import { DataTable, TableActions, Badge, EmptyState } from '@/components/shared/ui';
import type { AvanceWithDetails } from '../services/avanceService';
import { User, Building2, Wallet } from 'lucide-react';
import { iconConfig } from '@/config/icons';
import { formatCurrency, formatDateShort } from '@/lib/supabase/helpers';

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
                    {formatDateShort(avance.date_avance)}
                </span>
            )
        },
        {
            header: 'Entité',
            render: (avance: AvanceWithDetails) => {
                const isClient = !!avance.client;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isClient ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                            {isClient
                                ? <User className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                                : <Building2 className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                            }
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs sm:text-[13px] font-bold text-main">
                                {isClient
                                    ? `${avance.client?.nom} ${avance.client?.prenom}`
                                    : avance.societe?.nom_societe}
                            </span>
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted font-bold">
                                {isClient ? 'Client' : 'Société'}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Montant',
            render: (avance: AvanceWithDetails) => (
                <span className="text-xs sm:text-[13px] font-semibold text-success">
                    {formatCurrency(Number(avance.montant))}
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
                <EmptyState
                    icon={Wallet}
                    title="Aucun paiement trouvé"
                    description="Il n'y a pas encore de paiements enregistrés ou votre recherche est vide."
                />
            }
        />
    );
}
