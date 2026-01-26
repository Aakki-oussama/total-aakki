/**
 * SUPABASE ERROR HANDLER
 * Traduit les codes d'erreur techniques de PostgreSQL/Supabase en messages humains.
 */

// 🔧 FIX: Use 'unknown' instead of 'any' for error parameter (best practice)
export const mapSupabaseError = (error: unknown): string => {
    if (!error) return 'Une erreur inconnue est survenue.';

    // Type narrowing: check if error is an object with code/status properties
    if (typeof error !== 'object' || error === null) {
        return 'Une erreur inconnue est survenue.';
    }

    // Extraire le code (Postgres utilise souvent 'code', Supabase peut aussi utiliser d'autres champs)
    const errorObj = error as Record<string, unknown>;
    const code = errorObj.code || errorObj.status;
    const technicalMessage = (errorObj.message as string) || '';

    switch (code) {
        // Erreurs de contraintes (Unique, Foreign Key, etc.)
        case '23505':
            return 'Ce nom (ou identifiant) est déjà utilisé. Veuillez en choisir un autre.';
        case '23503':
            return 'Impossible de supprimer cet élément car il est lié à d\'autres données (ex: factures ou opérations).';
        case '23502': {
            const details = (errorObj.details as string) || (errorObj.message as string) || '';
            const hint = (errorObj.hint as string) || '';
            return `Certains champs obligatoires sont manquants. Détails: ${details} ${hint}`;
        }

        // Erreurs d'authentification et de permissions
        case 'PGRST301':
        case '401':
        case 401:
            return 'Votre session a expiré. Veuillez vous reconnecter.';
        case '42501':
        case '403':
        case 403:
            return 'Accès refusé : Vous n\'avez pas les permissions nécessaires dans Supabase (RLS).';

        // Erreurs de syntaxe ou de validation côté serveur
        case 'PGRST116':
            return 'La ressource demandée est introuvable.';
        case 'PGRST204':
            return 'Impossible de se connecter à la base de données.';

        // Erreurs réseau ou timeout
        case 'abort':
            return 'La requête a pris trop de temps. Veuillez réessayer.';

        default:
            // Détection par message textuel (pour les erreurs RLS remontées bizarrement)
            if (technicalMessage.toLowerCase().includes('violates row-level security policy')) {
                // On vérifie si c'est un code de doublon ou juste une interdiction
                if (code === '23505') return 'Ce nom est déjà utilisé.';
                return `Action refusée par la base de données (Code: ${code}). Vérifiez les permissions RLS.`;
            }

            if (technicalMessage.toLowerCase().includes('failed to fetch')) {
                return 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
            }
            if (technicalMessage.toLowerCase().includes('network error')) {
                return 'Erreur réseau. Veuillez vérifier votre connexion.';
            }

            return technicalMessage || 'Une erreur imprévue est survenue.';
    }
};
