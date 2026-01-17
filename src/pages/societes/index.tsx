import PageLayout from '@/components/layout/PageLayout';
import {
    Modal,
    DeleteConfirmationModal,
    SearchBar,
    DateFilter,
    PaginatedTableFooter
} from '@/components/shared/ui';
import { useSocietes } from '@/features/societes/hook/useSocietes';
import SocieteTable from '@/features/societes/components/tables/SocieteTable';
import SocieteForm from '@/features/societes/components/forms/SocieteForm';
import { useNavigate } from 'react-router-dom';

/**
 * PAGE: SocietesPage
 * Point central de gestion des sociétés.
 * Gère le listing, la recherche, la pagination et le formulaire Triple-Action.
 */
export default function SocietesPage() {
    const navigate = useNavigate();
    const {
        // Data & State
        societes,
        loading,
        isSubmitting,

        // Filters & Pagination
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        totalPages,

        // Modals & Handlers
        isFormModalOpen,
        isDeleteModalOpen,
        selectedSociete,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        handleFormSubmit,
        handleDeleteConfirm
    } = useSocietes();

    return (
        <PageLayout
            title="Gestion des Sociétés"
            description="Gérez vos sociétés partenaires, leurs chauffeurs et leur flotte de véhicules."
            onAdd={openCreateModal}
            variant="content"
        >
            <div className="flex flex-col gap-4 sm:gap-6">
                {/* BARRE D'OUTILS (Recherche & Filtres) - Style Harmonisé */}
                <div className="flex items-center gap-2 sm:gap-4 bg-surface/50 p-3 sm:p-4 rounded-2xl border border-border/50">
                    <div className="flex-1">
                        <SearchBar
                            value={searchTerm}
                            onChange={(val) => setSearchTerm(val)}
                            placeholder="Rechercher une société..."
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

                {/* TABLEAU ET PAGINATION */}
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                    <SocieteTable
                        societes={societes}
                        loading={loading}
                        onView={(societe) => navigate(`/societes/${societe.id}`)}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />

                    <PaginatedTableFooter
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        perPage={perPage}
                        onPerPageChange={setPerPage}
                        itemCount={societes.length}
                        entityName="sociétés"
                        searchTerm={searchTerm}
                    />
                </div>
            </div>

            {/* MODAL: Formulaire Triple-Action */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={closeModals}
                title={selectedSociete ? 'Modifier la société' : 'Nouvelle société'}
                description={selectedSociete ? 'Modifiez les informations de la société.' : 'Créez une nouvelle société avec ses chauffeurs et véhicules.'}
                size="xl"
            >
                <SocieteForm
                    initialData={selectedSociete}
                    isSubmitting={isSubmitting}
                    onSubmit={handleFormSubmit}
                    onCancel={closeModals}
                />
            </Modal>

            {/* MODAL: Confirmation de Suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                onConfirm={handleDeleteConfirm}
                title="Supprimer cette société ?"
                description={`Voulez-vous vraiment supprimer la société "${selectedSociete?.nom_societe}" ? Cette action est irréversible.`}
                loading={isSubmitting}
            />
        </PageLayout>
    );
}
