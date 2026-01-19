import PageLayout from '@/components/layout/PageLayout';
import { useAvances } from '@/features/transactions/hooks/useAvances';
import AvanceTable from '@/features/transactions/components/AvanceTable';
import AvanceForm from '@/features/transactions/components/AvanceForm';
import { SearchBar, DateFilter, PaginatedTableFooter, DeleteConfirmationModal } from '@/components/shared/ui';

/**
 * PAGE: Avances (Paiements)
 * Point d'entrée pour la gestion des paiements.
 * Design calqué sur la page Clients pour une cohérence parfaite.
 */
export default function AvancesPage() {
    const {
        avances,
        loading,
        isSubmitting,

        // Hooks / UI Controls
        pagination,
        filters,
        isFormModalOpen,
        isDeleteModalOpen,
        selectedAvance,

        // Handlers
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        handleFormSubmit,
        handleDeleteConfirm,
        handleQuickCreateClient,
        handleQuickCreateSociete
    } = useAvances();

    return (
        <PageLayout
            title="Gestion des Paiements"
            description="Suivez et enregistrez toutes les rentrées d'argent des clients et sociétés."
            variant="content"
            onAdd={openCreateModal}
        >
            <div className="space-y-6">
                {/* Barre d'outils (Recherche & Filtres) - EXACTEMENT comme Client */}
                <div className="flex items-center gap-2 sm:gap-4 bg-surface/50 p-3 sm:p-4 rounded-2xl border border-border/50">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Rechercher un paiement..."
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
                <div className="border border-border rounded-2xl overflow-hidden bg-surface shadow-sm">
                    <AvanceTable
                        avances={avances}
                        loading={loading}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />

                    <PaginatedTableFooter
                        loading={loading}
                        itemCount={avances.length}
                        totalPages={pagination.totalPages}
                        perPage={pagination.perPage}
                        currentPage={pagination.currentPage}
                        onPageChange={pagination.setCurrentPage}
                        onPerPageChange={pagination.setPerPage}
                        entityName="paiements"
                        searchTerm={filters.searchTerm}
                    />
                </div>
            </div>

            {/* Modal de Formulaire */}
            {isFormModalOpen && (
                <AvanceForm
                    isOpen={isFormModalOpen}
                    onClose={closeModals}
                    initialData={selectedAvance}
                    onSubmit={handleFormSubmit}
                    onQuickCreateClient={handleQuickCreateClient}
                    onQuickCreateSociete={handleQuickCreateSociete}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Modal de Confirmation de Suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                onConfirm={handleDeleteConfirm}
                title="Supprimer ce paiement ?"
                description="Voulez-vous vraiment supprimer cet enregistrement ? Cette action est irréversible."
                loading={isSubmitting}
            />
        </PageLayout>
    );
}
