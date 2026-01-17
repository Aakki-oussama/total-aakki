import { Pagination, PerPageSelector } from './index';

interface PaginatedTableFooterProps {
    /** Indique si les données sont en cours de chargement */
    loading: boolean;
    /** Nombre d'éléments affichés actuellement */
    itemCount: number;
    /** Page actuelle (commence à 1) */
    currentPage: number;
    /** Nombre d'éléments par page */
    perPage: number;
    /** Nombre total de pages */
    totalPages: number;
    /** Callback quand l'utilisateur change de page */
    onPageChange: (page: number) => void;
    /** Callback quand l'utilisateur change le nombre par page */
    onPerPageChange: (perPage: number) => void;
    /** Terme de recherche actif (optionnel, pour message contextuel) */
    searchTerm?: string;
    /** Message personnalisé quand aucun résultat (optionnel) */
    emptyMessage?: string;
    /** Nom de l'entité au pluriel (ex: "clients", "véhicules") */
    entityName?: string;
}

/**
 * COMPONENT: PaginatedTableFooter
 * Footer réutilisable pour tous les tableaux paginés.
 * Affiche la pagination ou un message d'état vide selon les résultats.
 */
export default function PaginatedTableFooter({
    loading,
    itemCount,
    currentPage,
    perPage,
    totalPages,
    onPageChange,
    onPerPageChange,
    searchTerm = '',
    emptyMessage,
    entityName = 'éléments'
}: PaginatedTableFooterProps) {
    // Ne rien afficher pendant le chargement
    if (loading) return null;

    // Cas 1 : Des résultats existent
    if (itemCount > 0) {
        return (
            <div className="flex flex-row gap-2 justify-between items-center bg-muted/5 p-2 sm:p-3 md:p-4 border-t border-border">
                <PerPageSelector
                    value={perPage}
                    onChange={onPerPageChange}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        );
    }

    // Cas 2 : Aucun résultat
    const defaultMessage = emptyMessage || `Aucun ${entityName} ne correspond à vos critères de recherche.`;

    return (
        <div className="p-4 sm:p-6 md:p-8 text-center border-t border-border bg-muted/5">
            <p className="text-sm text-muted font-medium">
                {defaultMessage}
            </p>
            {searchTerm && (
                <p className="text-xs text-muted/70 mt-2">
                    Essayez de modifier votre recherche ou d'ajouter un nouveau {entityName.replace(/s$/, '')}.
                </p>
            )}
        </div>
    );
}
