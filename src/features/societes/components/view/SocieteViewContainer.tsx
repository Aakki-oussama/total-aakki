import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Spinner, PaginatedTableFooter } from '@/components/shared/ui';
import { societeService } from '@/features/societes/services/societeService';
import type { Societe } from '@/types/tables';

// Hooks
import { useEmployes } from '@/features/societes/hook/useEmployes';
import { useVehicules } from '@/features/societes/hook/useVehicules';

// Composants Tableaux
import EmployeTable from '@/features/societes/components/tables/EmployeTable';
import VehiculeTable from '@/features/societes/components/tables/VehiculeTable';

// Parts
import ViewHeader from './parts/ViewHeader';
import ViewTabs from './parts/ViewTabs';
import ViewModals from './parts/ViewModals';
import ViewToolbar from './parts/ViewToolbar';

import { useResourceTitle } from '@/context/ResourceTitleContext';

/**
 * COMPONENT: SocieteViewContainer (Refactorisé)
 * Gère la logique de filtrage, recherche et pagination pour les deux types de données.
 */
export default function SocieteViewContainer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setResourceTitle } = useResourceTitle();
    const [societe, setSociete] = useState<Societe | null>(null);
    const [loadingSociete, setLoadingSociete] = useState(true);
    const [activeTab, setActiveTab] = useState<'employes' | 'vehicules'>('employes');

    // 1. Logique Employés (Lazy loading si onglet actif)
    const empHook = useEmployes(id, activeTab === 'employes');

    // 2. Logique Véhicules (Lazy loading si onglet actif)
    const vehHook = useVehicules(id, activeTab === 'vehicules');

    // Charger les infos de la société
    useEffect(() => {
        if (!id) return;
        societeService.getSocieteById(id)
            .then(data => {
                setSociete(data);
                if (data) setResourceTitle(id, data.nom_societe);
            })
            .catch(() => navigate('/societes'))
            .finally(() => setLoadingSociete(false));
    }, [id, navigate, setResourceTitle]);

    if (loadingSociete) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    );

    if (!societe) return null;

    return (
        <PageLayout
            title={societe.nom_societe}
            description="Consultez et gérez les informations de l'entreprise, le personnel et la flotte."
            variant="content"
            onAdd={activeTab === 'employes' ? empHook.openCreateModal : vehHook.openCreateModal}
        >
            <div className="flex flex-col gap-4 sm:gap-6">
                {/* 1. Navigation & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <ViewHeader />
                    </div>
                    <div className="w-full sm:w-auto">
                        <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                </div>

                {/* 2. Barre d'outils (Recherche & Filtres) */}
                {activeTab === 'employes' ? (
                    <ViewToolbar
                        searchTerm={empHook.searchTerm}
                        onSearchChange={empHook.setSearchTerm}
                        selectedDate={empHook.selectedDate}
                        onDateChange={empHook.setSelectedDate}
                        placeholder="Rechercher un chauffeur..."
                    />
                ) : (
                    <ViewToolbar
                        searchTerm={vehHook.searchTerm}
                        onSearchChange={vehHook.setSearchTerm}
                        selectedDate={vehHook.selectedDate}
                        onDateChange={vehHook.setSelectedDate}
                        placeholder="Rechercher un véhicule..."
                    />
                )}

                {/* 3. Section Tableau (Table + Pagination) - Exactement comme l'index */}
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                    {/* Tableau direct, pas de header interne */}
                    {activeTab === 'employes' ? (
                        <EmployeTable
                            employes={empHook.employes} loading={empHook.loading}
                            onEdit={empHook.openEditModal} onDelete={empHook.openDeleteModal}
                        />
                    ) : (
                        <VehiculeTable
                            vehicules={vehHook.vehicules} loading={vehHook.loading}
                            onEdit={vehHook.openEditModal} onDelete={vehHook.openDeleteModal}
                        />
                    )}

                    {/* Pagination direct après le tableau */}
                    {activeTab === 'employes' ? (
                        <PaginatedTableFooter
                            loading={empHook.loading}
                            itemCount={empHook.employes.length}
                            currentPage={empHook.currentPage}
                            perPage={empHook.perPage}
                            totalPages={empHook.totalPages}
                            onPageChange={empHook.setCurrentPage}
                            onPerPageChange={empHook.setPerPage}
                            searchTerm={empHook.searchTerm}
                            entityName="chauffeurs"
                        />
                    ) : (
                        <PaginatedTableFooter
                            loading={vehHook.loading}
                            itemCount={vehHook.vehicules.length}
                            currentPage={vehHook.currentPage}
                            perPage={vehHook.perPage}
                            totalPages={vehHook.totalPages}
                            onPageChange={vehHook.setCurrentPage}
                            onPerPageChange={vehHook.setPerPage}
                            searchTerm={vehHook.searchTerm}
                            entityName="véhicules"
                        />
                    )}
                </div>
            </div>

            <ViewModals
                societeId={id!}
                empForm={{
                    isOpen: empHook.isFormModalOpen, selected: empHook.selectedEmploye,
                    close: empHook.closeModals, submit: empHook.handleFormSubmit,
                    isSubmitting: empHook.isSubmitting
                }}
                empDelete={{ isOpen: empHook.isDeleteModalOpen, confirm: empHook.handleDeleteConfirm }}
                vehForm={{
                    isOpen: vehHook.isFormModalOpen, selected: vehHook.selectedVehicule,
                    close: vehHook.closeModals, submit: vehHook.handleFormSubmit,
                    isSubmitting: vehHook.isSubmitting
                }}
                vehDelete={{ isOpen: vehHook.isDeleteModalOpen, confirm: vehHook.handleDeleteConfirm }}
            />
        </PageLayout>
    );
}
