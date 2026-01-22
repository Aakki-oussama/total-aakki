import { Fuel, Wallet, ArrowRightLeft } from 'lucide-react';
import { DataTable } from '@/components/shared/ui';
import type { Column } from '@/components/shared/ui/DataTable';
import type { HistoryItem } from '@/types/views';

interface ClientHistoryTableProps {
    history: HistoryItem[];
    loading?: boolean;
}

/**
 * COMPONENT: ClientHistoryTable
 * Affiche le relevé de compte complet (gasoil + paiements) 
 * Utilisant notre composant DataTable standard.
 */
export default function ClientHistoryTable({ history, loading }: ClientHistoryTableProps) {

    // Définition des colonnes pour le DataTable
    const columns: Column<HistoryItem>[] = [
        {
            header: 'Date',
            render: (item) => (
                <span className="text-sm font-bold text-main">
                    {new Date(item.date_operation).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
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
                    -{item.debit.toLocaleString('fr-FR')} DH
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
                    +{item.credit.toLocaleString('fr-FR')} DH
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
                    {Math.abs(item.solde_ligne).toLocaleString('fr-FR')} DH
                </span>
            )
        }
    ];

    const emptyState = (
        <div className="py-20 text-center">
            <ArrowRightLeft className="mx-auto h-12 w-12 text-muted/30 mb-4" />
            <h3 className="text-xl font-bold text-main">Aucun historique</h3>
            <p className="text-muted max-w-sm mx-auto mt-2 text-sm">
                Aucune transaction (Gasoil ou Paiement) n'a été enregistrée pour ce client.
            </p>
        </div>
    );

    return (
        <DataTable
            data={history}
            columns={columns}
            loading={loading}
            emptyState={emptyState}
        />
    );
}
