import PageLayout from '@/components/layout/PageLayout';
import { useGasoil } from '@/features/transactions/hooks/useGasoil';
import { GasoilTable } from '@/features/transactions/components/GasoilTable';
import GasoilForm from '@/features/transactions/components/GasoilForm';
import { SearchBar, DateFilter, PaginatedTableFooter, DeleteConfirmationModal } from '@/components/shared/ui';

/**
 * PAGE: Gasoil (Dépenses Carburant)
 * Point d'entrée pour la gestion des consommations de carburant.
 * Offre une vue détaillée avec recherche et filtrage par date.
 */
export default function GasoilPage() {
    const {
        gasoils,
        loading,
        isSubmitting,
        pagination,
        filters,
        modals,
        handleFormSubmit,
        handleDeleteConfirm,
    } = useGasoil();

    return (
        <PageLayout
            title="Consommations Gasoil"
            description="Gérez et suivez les dépenses en carburant pour les clients et les flottes de sociétés."
            variant="content"
            onAdd={modals.openCreate}
        >
            <div className="space-y-6">
                {/* Barre d'outils (Recherche & Filtres) */}
                <div className="flex items-center gap-2 sm:gap-4 bg-surface/50 p-3 sm:p-4 rounded-2xl border border-border/50">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Rechercher par client ou société..."
                            value={filters.searchTerm}
                            onChange={filters.setSearchTerm}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <DateFilter
                            date={filters.selectedDate}
                            onDateChange={filters.setSelectedDate}
                            label="Date"
                        />
                    </div>
                </div>

                {/* Section Tableau avec Pagination */}
                <div className="border border-border rounded-2xl overflow-hidden bg-surface shadow-sm transition-all duration-300">
                    <GasoilTable
                        data={gasoils}
                        loading={loading}
                        onEdit={modals.openEdit}
                        onDelete={modals.openDelete}
                    />

                    <PaginatedTableFooter
                        loading={loading}
                        itemCount={gasoils.length}
                        totalPages={pagination.totalPages}
                        perPage={pagination.perPage}
                        currentPage={pagination.currentPage}
                        onPageChange={pagination.setCurrentPage}
                        onPerPageChange={pagination.setPerPage}
                        entityName="consommations"
                        searchTerm={filters.searchTerm}
                    />
                </div>
            </div>

            {/* Modal de Formulaire (Lazy Loaded) */}
            {modals.isFormOpen && (
                <GasoilForm
                    isOpen={modals.isFormOpen}
                    onClose={modals.closeAll}
                    initialData={modals.selectedItem}
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Modal de Confirmation de Suppression */}
            <DeleteConfirmationModal
                isOpen={modals.isDeleteOpen}
                onClose={modals.closeAll}
                onConfirm={handleDeleteConfirm}
                title="Supprimer cette consommation ?"
                description="Cette action supprimera l'enregistrement et recalculera automatiquement le solde du bénéficiaire. Voulez-vous continuer ?"
                loading={isSubmitting}
            />
        </PageLayout>
    );
}
