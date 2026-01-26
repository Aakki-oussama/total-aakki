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
                <span className="text-xs sm:text-[13px] font-bold text-main">
                    {formatDateShort(item.date_operation)}
                </span>
            )
        },
        {
            header: 'Opération',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${item.type === 'GASOIL'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-info/10 text-info'
                        }`}>
                        {item.type === 'GASOIL' ? <Fuel size={16} /> : <Wallet size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs sm:text-[13px] font-semibold text-main">{item.type}</span>
                        <span className="text-[9px] sm:text-[10px] text-muted truncate max-w-[200px]">{item.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Débit (-)',
            render: (item) => item.debit > 0 ? (
                <span className="text-xs sm:text-[13px] font-semibold text-danger">
                    -{formatCurrency(item.debit)}
                </span>
            ) : (
                <span className="text-muted/30">—</span>
            )
        },
        {
            header: 'Crédit (+)',
            render: (item) => item.credit > 0 ? (
                <span className="text-xs sm:text-[13px] font-semibold text-success">
                    +{formatCurrency(item.credit)}
                </span>
            ) : (
                <span className="text-muted/30">—</span>
            )
        },
        {
            header: 'Solde',
            render: (item) => (
                <span className={`text-xs sm:text-[13px] font-black ${item.solde_ligne < 0 ? 'text-danger' : 'text-success'
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
