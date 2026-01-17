import PageLayout from '@/components/layout/PageLayout';
import { useClients } from '@/features/clients/hook/useClients';
import ClientTable from '@/features/clients/components/ClientTable';
import ClientForm from '@/features/clients/components/ClientForm';
import { Modal, DeleteConfirmationModal, SearchBar, DateFilter, PaginatedTableFooter } from '@/components/shared/ui';

/**
 * PAGE: Clients
 * Point d'entrée pour la gestion des clients.
 * Utilise le hook useClients pour centraliser la logique et les modals.
 */
export default function ClientsPage() {
    const {
        clients,
        loading,
        isSubmitting,
        isFormModalOpen,
        isDeleteModalOpen,
        selectedClient,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        handleFormSubmit,
        handleDeleteConfirm,
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,
        // Pagination
        currentPage,
        perPage,
        totalPages,
        setCurrentPage,
        setPerPage
    } = useClients();

    return (
        <PageLayout
            title="Clients"
            description="Gérez votre liste de clients, ajoutez de nouveaux profils ou modifiez les informations existantes."
            variant="content"
            onAdd={openCreateModal}
        >
            <div className="space-y-6">
                {/* Barre d'outils (Recherche & Filtres) */}
                <div className="flex items-center gap-2 sm:gap-4 bg-surface/50 p-3 sm:p-4 rounded-2xl border border-border/50">
                    <div className="flex-1">
                        <SearchBar
                            value={searchTerm}
                            onChange={(val) => setSearchTerm(val)}
                            placeholder="Rechercher..."
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <DateFilter
                            date={selectedDate}
                            onDateChange={setSelectedDate}
                            label="Date"
                        />
                    </div>
                </div>

                {/* Section Tableau avec Pagination */}
                <div className="border border-border rounded-2xl overflow-hidden bg-surface shadow-sm">
                    <ClientTable
                        clients={clients}
                        loading={loading}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />


                    {/* Footer - Pagination réutilisable */}
                    <PaginatedTableFooter
                        loading={loading}
                        itemCount={clients.length}
                        currentPage={currentPage}
                        perPage={perPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onPerPageChange={setPerPage}
                        searchTerm={searchTerm}
                        entityName="clients"
                    />
                </div>
            </div>

            {/* Modal de Formulaire (Ajout / Modification) */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={closeModals}
                title={selectedClient ? 'Modifier le client' : 'Nouveau client'}
                description={selectedClient ? 'Modifiez les informations personnelles du client.' : 'Remplissez les informations pour enregistrer un nouveau client.'}
                size="md"
            >
                <ClientForm
                    initialData={selectedClient}
                    onSubmit={handleFormSubmit}
                    onCancel={closeModals}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Modal de Confirmation de Suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                onConfirm={handleDeleteConfirm}
                title="Supprimer ce client ?"
                description={`Voulez-vous vraiment supprimer le client "${selectedClient?.nom} ${selectedClient?.prenom}" ? Cette action est irréversible.`}
                loading={isSubmitting}
            />
        </PageLayout>
    );
}
