import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SocieteIdentityHeader from '../SocieteIdentityHeader';
import SocieteStats from '../SocieteStats';
import HistoryTable from '@/features/shared/components/HistoryTable';
import { useSocieteDetails } from '../../hook/useSocieteDetails';
import { useSocieteHistory } from '../../hook/useSocieteHistory';
import { Spinner, SearchBar, DateFilter, PaginatedTableFooter } from '@/components/shared/ui';
import HistoryExport from '@/features/shared/components/HistoryExport';

/**
 * COMPONENT: SocieteViewContainer
 * Affiche l'identité de la société, ses stats financières et son historique.
 */
export default function SocieteViewContainer() {
    const { id } = useParams<{ id: string }>();
    const { societe, loading: loadingSociete } = useSocieteDetails(id);
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
    } = useSocieteHistory(id);

    if (loadingSociete) {
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
                <SocieteIdentityHeader
                    societe={societe ? { nom_societe: societe.nom_societe } : undefined}
                />

                {/* 2. Cartes de Statistiques Financières */}
                <SocieteStats
                    solde={societe?.solde || { solde_actuel: 0, total_avances: 0, total_gasoil: 0 }}
                    totalTransactions={societe?.total_transactions || 0}
                />

                {/* 3. Relevé de compte chronologique */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-black text-main">
                            Historique des Opérations
                        </h2>

                        {/* Barre d'outils */}
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
                                entityType="societe"
                                entityName={societe?.nom_societe || 'Société'}
                            />
                        </div>
                    </div>

                    <div className="border border-border rounded-3xl overflow-hidden bg-surface shadow-sm">
                        <HistoryTable
                            history={history}
                            loading={loadingHistory}
                            entityName={societe?.nom_societe || 'cette société'}
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