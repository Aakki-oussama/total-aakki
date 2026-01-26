-- ==========================================================
-- RLS POLICIES - VERSION SIMPLIFIÉE (1-3 UTILISATEURS)
-- ==========================================================

-- ==========================================================
-- ÉTAPE 1: Function de Vérification (Whitelist)
-- Cette fonction vérifie si l'email de la personne connectée
-- est dans votre liste autorisée.
-- ==========================================================

CREATE OR REPLACE FUNCTION is_authorized_user()
RETURNS BOOLEAN AS $$
BEGIN
    -- Remplacer les emails ci-dessous par VOS vrais emails
    RETURN (
        auth.jwt() ->> 'email' IN (
            'aakkioussama@gmail.com',
            'sitet8755@gmail.com'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================================
-- ÉTAPE 2: Activer la sécurité (RLS) sur toutes les tables
-- ==========================================================

ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE societe ENABLE ROW LEVEL SECURITY;
ALTER TABLE avance ENABLE ROW LEVEL SECURITY;
ALTER TABLE gasoil ENABLE ROW LEVEL SECURITY;
ALTER TABLE solde ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- ÉTAPE 3: Créer les Politiques (Accès 全 Accès)
-- On donne tous les droits (Voir, Ajouter, Modifier, Supprimer)
-- UNIQUEMENT aux personnes de la liste ci-dessus.
-- ==========================================================

-- --- POLICIES TABLE : CLIENT ---
CREATE POLICY "Full Access Clients" ON client
FOR ALL TO authenticated USING (is_authorized_user()) WITH CHECK (is_authorized_user());

-- --- POLICIES TABLE : SOCIETE ---
CREATE POLICY "Full Access Societes" ON societe
FOR ALL TO authenticated USING (is_authorized_user()) WITH CHECK (is_authorized_user());

-- --- POLICIES TABLE : AVANCE ---
CREATE POLICY "Full Access Avances" ON avance
FOR ALL TO authenticated USING (is_authorized_user()) WITH CHECK (is_authorized_user());

-- --- POLICIES TABLE : GASOIL ---
CREATE POLICY "Full Access Gasoil" ON gasoil
FOR ALL TO authenticated USING (is_authorized_user()) WITH CHECK (is_authorized_user());

-- --- POLICIES TABLE : SOLDE ---
CREATE POLICY "Full Access Soldes" ON solde
FOR ALL TO authenticated USING (is_authorized_user()) WITH CHECK (is_authorized_user());


-- ==========================================================
-- COMMENT UTILISER CE FICHIER :
-- ==========================================================
--
-- 1. Copie tout ce code.
-- 2. Va sur ton Dashboard Supabase -> SQL Editor.
-- 3. Colle le code.
-- 4. MODIFIE les emails à la ligne 16 et 17 par tes vrais emails.
-- 5. Clique sur "Run".
--
-- Félicitations ! Ta base de données est maintenant 
-- une forteresse accessible uniquement par TOI.
-- ==========================================================