import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ClientIdentityHeader from '@/features/clients/components/ClientIdentityHeader';
import ClientStats from '@/features/clients/components/ClientStats';
import HistoryTable from '@/features/shared/components/HistoryTable';
import { useClientDetails } from '@/features/clients/hooks/useClientDetails';
import { useClientHistory } from '@/features/clients/hooks/useClientHistory';
import { Spinner, SearchBar, DateFilter, PaginatedTableFooter } from '@/components/shared/ui';
import HistoryExport from '@/features/shared/components/HistoryExport';

/**
 * PAGE: ClientView (Profil Client)
 * Affiche l'identité complète d'un client et son historique financier.
 */
export default function ClientView() {
    const { id } = useParams<{ id: string }>();
    const { client, loading: loadingClient } = useClientDetails(id);
    const {
        history,
        loading: loadingHistory,
        page,
        perPage,
        searchTerm,
        dateFilter,
        totalPages,
        setPage,
        setPerPage,
        setSearchTerm,
        setDateFilter
    } = useClientHistory(id);

    const loading = loadingClient; // On ne bloque la page QUE sur le client au début

    // STRATÉGIE "TOUT OU RIEN" : On ne montre QUE le spinner sans aucune structure de page au début
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <PageLayout variant="content" title="" description="">
            <div className="space-y-8 -mt-8">
                {/* 1. Header d'identité */}
                <ClientIdentityHeader
                    client={client ? { nom: client.nom, prenom: client.prenom } : undefined}
                />

                {/* 2. Cartes de Statistiques Financières */}
                <ClientStats
                    solde={client?.solde || { solde_actuel: 0, total_avances: 0, total_gasoil: 0 }}
                    totalTransactions={client?.total_transactions || 0}
                />

                {/* 3. Relevé de compte chronologique (Fusionné) */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-black text-main">
                            Historique des Opérations
                        </h2>

                        {/* Barre d'outils Interne */}
                        <div className="flex items-center gap-2">
                            <div className="w-full sm:w-64">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Rechercher une opération..."
                                />
                            </div>
                            <DateFilter
                                date={dateFilter}
                                onDateChange={setDateFilter}
                            />

                            <div className="border-l border-border h-8 mx-1 hidden sm:block" />

                            <HistoryExport
                                entityId={id || ''}
                                entityType="client"
                                entityName={client ? `${client.nom} ${client.prenom}` : 'Client'}
                            />
                        </div>
                    </div>

                    <div className="border border-border rounded-3xl overflow-hidden bg-surface shadow-sm">
                        <HistoryTable
                            history={history}
                            loading={loadingHistory}
                            entityName={client ? `${client.nom} ${client.prenom}` : 'ce client'}
                        />

                        <PaginatedTableFooter
                            loading={loadingHistory}
                            itemCount={history.length}
                            currentPage={page}
                            perPage={perPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            onPerPageChange={setPerPage}
                            searchTerm={searchTerm}
                            entityName="opérations"
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
