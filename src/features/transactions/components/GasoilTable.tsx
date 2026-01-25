import { useMemo } from 'react';
import { Fuel, User, Building2 } from 'lucide-react';
import { DataTable, TableActions, EmptyState } from '@/components/shared/ui';
import type { GasoilWithDetails } from '../services/gasoilService';
import { iconConfig } from '@/config/icons';
import { formatCurrency, formatDateShort } from '@/lib/supabase/helpers';

interface GasoilTableProps {
    data: GasoilWithDetails[];
    loading: boolean;
    onEdit?: (item: GasoilWithDetails) => void;
    onDelete?: (item: GasoilWithDetails) => void;
}

/**
 * COMPONENT: GasoilTable
 * Affiche la liste des consommations de gasoil (simplifié sans logistique).
 */
export function GasoilTable({ data, loading, onEdit, onDelete }: GasoilTableProps) {
    const columns = useMemo(() => [
        {
            header: 'Date',
            render: (item: GasoilWithDetails) => (
                <span className="text-muted font-medium">
                    {item.date_gasoil ? formatDateShort(item.date_gasoil) : '-'}
                </span>
            )
        },
        {
            header: 'Bénéficiaire',
            render: (item: GasoilWithDetails) => (
                <div className="flex items-center gap-3">
                    {item.client_id ? (
                        <>
                            <div className="p-2 rounded-lg bg-success/10 text-success">
                                <User className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                            </div>
                            <span className="font-bold text-main">
                                {item.client?.nom} {item.client?.prenom}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="p-2 rounded-lg bg-info/10 text-info">
                                <Building2 className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                            </div>
                            <span className="font-bold text-main">
                                {item.societe?.nom_societe}
                            </span>
                        </>
                    )}
                </div>
            )
        },
        {
            header: 'Montant',
            render: (item: GasoilWithDetails) => (
                <div className="flex items-center gap-1.5 font-bold text-warning bg-warning/10 px-2 py-1 rounded">
                    <Fuel className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                    <span className="text-sm">{formatCurrency(Number(item.montant))}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (item: GasoilWithDetails) => (
                <TableActions
                    onEdit={onEdit ? () => onEdit(item) : undefined}
                    onDelete={onDelete ? () => onDelete(item) : undefined}
                />
            )
        }
    ], [onEdit, onDelete]);

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyState={
                <EmptyState
                    icon={Fuel}
                    title="Aucune consommation trouvée"
                    description="Il n'y a pas encore de consommations de gasoil enregistrées."
                />
            }
        />
    );
}
