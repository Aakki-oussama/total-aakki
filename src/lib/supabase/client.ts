/**
 * CLIENT SUPABASE
 * Configuration et initialisation de la connexion à Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifier que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '⚠️ ERREUR: Les variables d\'environnement Supabase ne sont pas définies.\n' +
        'Créez un fichier .env à la racine du projet avec:\n' +
        'VITE_SUPABASE_URL=votre-url\n' +
        'VITE_SUPABASE_ANON_KEY=votre-cle'
    );
}

/**
 * Client Supabase configuré
 * Utilisez cet objet pour toutes les requêtes à la base de données
 * 
 * @example
 * ```typescript
 * import { supabase } from '@/lib/supabase/client';
 * 
 * const { data, error } = await supabase
 *   .from('client')
 *   .select('*');
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public',
    },
});
