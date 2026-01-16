/**
 * SUPABASE ERROR HANDLER
 * Traduit les codes d'erreur techniques de PostgreSQL/Supabase en messages humains.
 */

export const mapSupabaseError = (error: any): string => {
    if (!error) return 'Une erreur inconnue est survenue.';

    // Extraire le code (Postgres utilise souvent 'code', Supabase peut aussi utiliser d'autres champs)
    const code = error.code || error.status;
    const technicalMessage = error.message || '';

    switch (code) {
        // Erreurs de contraintes (Unique, Foreign Key, etc.)
        case '23505':
            return 'Cet enregistrement existe déjà dans la base de données.';
        case '23503':
            return 'Impossible de supprimer cet élément car il est lié à d\'autres données.';
        case '23502':
            return 'Certains champs obligatoires sont manquants.';

        // Erreurs d'authentification et de permissions
        case 'PGRST301':
        case '401':
        case 401:
            return 'Votre session a expiré. Veuillez vous reconnecter.';
        case '403':
        case 403:
            return 'Vous n\'avez pas la permission d\'effectuer cette action.';

        // Erreurs de syntaxe ou de validation côté serveur
        case 'PGRST116':
            return 'La ressource demandée est introuvable.';
        case 'PGRST204':
            return 'Impossible de se connecter à la base de données.';

        // Erreurs réseau ou timeout
        case 'abort':
            return 'La requête a pris trop de temps. Veuillez réessayer.';

        default:
            // Si le message contient des mots clés spécifiques
            if (technicalMessage.toLowerCase().includes('failed to fetch')) {
                return 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
            }
            if (technicalMessage.toLowerCase().includes('network error')) {
                return 'Erreur réseau. Veuillez vérifier votre connexion.';
            }

            return technicalMessage || 'Une erreur imprévue est survenue.';
    }
};
