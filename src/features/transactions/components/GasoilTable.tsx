import { useMemo } from 'react';
import { Fuel, User, Building2 } from 'lucide-react';
import { DataTable, TableActions } from '@/components/shared/ui';
import type { GasoilWithDetails } from '../services/gasoilService';
import { iconConfig } from '@/config/icons';

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
                <div className="flex flex-col text-left font-medium text-muted">
                    <span>
                        {item.date_gasoil ? new Date(item.date_gasoil).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }) : '-'}
                    </span>
                </div>
            )
        },
        {
            header: 'Bénéficiaire',
            render: (item: GasoilWithDetails) => (
                <div className="flex items-center gap-2">
                    {item.client_id ? (
                        <>
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                <User className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                            </div>
                            <span className="font-bold text-main">
                                {item.client?.nom} {item.client?.prenom}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
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
                <div className="flex items-center gap-1.5 font-bold text-amber-600">
                    <Fuel className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                    <span className="text-base">{Number(item.montant).toLocaleString('fr-FR')}</span>
                    <span className="text-[10px] font-medium opacity-60">DH</span>
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
                <div className="py-20 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted font-medium">Aucune consommation de gasoil trouvée.</p>
                </div>
            }
        />
    );
}
