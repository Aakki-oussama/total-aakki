import { Fuel, Wallet, ArrowRightLeft } from 'lucide-react';
import { DataTable, EmptyState } from '@/components/shared/ui';
import type { Column } from '@/components/shared/ui/DataTable';
import type { HistoryItem } from '@/types/views';
import { formatCurrency, formatDateShort } from '@/lib/supabase/helpers';

interface HistoryTableProps {
    history: HistoryItem[];
    loading?: boolean;
    entityName?: string;
}

/**
 * COMPONENT: HistoryTable
 * Affiche le relevé de compte complet (gasoil + paiements) 
 * Utilisable pour les Clients comme pour les Sociétés.
 */
export default function HistoryTable({ history, loading, entityName = 'ce bénéficiaire' }: HistoryTableProps) {

    const columns: Column<HistoryItem>[] = [
        {
            header: 'Date',
            render: (item) => (
                <span className="text-sm font-bold text-main">
                    {formatDateShort(item.date_operation)}
                </span>
            )
        },
        {
            header: 'Opération',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${item.type === 'GASOIL'
                        ? 'bg-orange-500/10 text-orange-600'
                        : 'bg-blue-500/10 text-blue-600'
                        }`}>
                        {item.type === 'GASOIL' ? <Fuel size={18} /> : <Wallet size={18} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-main">{item.type}</span>
                        <span className="text-xs text-muted truncate max-w-[200px]">{item.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Débit (-)',
            className: 'text-right',
            render: (item) => item.debit > 0 ? (
                <span className="text-sm font-bold text-red-600">
                    -{formatCurrency(item.debit)}
                </span>
            ) : (
                <span className="text-muted/30">—</span>
            )
        },
        {
            header: 'Crédit (+)',
            className: 'text-right',
            render: (item) => item.credit > 0 ? (
                <span className="text-sm font-bold text-emerald-600">
                    +{formatCurrency(item.credit)}
                </span>
            ) : (
                <span className="text-muted/30">—</span>
            )
        },
        {
            header: 'Solde',
            className: 'text-right',
            render: (item) => (
                <span className={`text-sm font-black ${item.solde_ligne < 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                    {formatCurrency(item.solde_ligne)}
                </span>
            )
        }
    ];

    return (
        <DataTable
            data={history}
            columns={columns}
            loading={loading}
            emptyState={
                <EmptyState
                    icon={ArrowRightLeft}
                    title="Aucun historique"
                    description={`Aucune transaction (Gasoil ou Paiement) n'a été enregistrée pour ${entityName}.`}
                />
            }
        />
    );
}
