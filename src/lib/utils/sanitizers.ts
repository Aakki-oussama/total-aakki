/**
 * UTILS: Sanitizers
 * Fonctions utilitaires pour nettoyer et formater les saisies utilisateur en temps réel.
 * Ces fonctions sont utilisées pour empêcher la saisie de caractères invalides.
 */

export const sanitize = {
    /**
     * Alpha: Autorise uniquement les lettres (incluant accents), espaces, tirets et apostrophes.
     * Idéal pour : Noms, Prénoms, Villes.
     */
    alpha: (val: string): string => {
        // Regex: Lettres A-Z, accents français, espaces, tirets, apostrophes
        return val.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
    },

    /**
     * Alphanumeric: Autorise uniquement les lettres et les chiffres.
     * Idéal pour : Plaques d'immatriculation, Codes de référence.
     */
    alphanumeric: (val: string): string => {
        return val.replace(/[^A-Za-z0-9]/g, '');
    },

    /**
     * Numeric: Autorise uniquement les chiffres.
     * Idéal pour : Numéros de téléphone, Codes postaux, IDs numériques.
     */
    numeric: (val: string): string => {
        return val.replace(/[^0-9]/g, '');
    },

    /**
     * Price: Autorise les chiffres et un seul point décimal.
     * Idéal pour : Montants, Prix, Quantités de carburant.
     */
    price: (val: string): string => {
        // Supprime tout ce qui n'est pas chiffre ou point
        let cleaned = val.replace(/[^0-9.]/g, '');

        // Empêche d'avoir plus d'un point décimal
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        return cleaned;
    },

    /**
     * Capitalize: Met la première lettre en majuscule et le reste en minuscule.
     */
    capitalize: (val: string): string => {
        if (!val) return '';
        const trimmed = val.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }
};
