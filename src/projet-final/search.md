-- ============================================
-- VUES DE RECHERCHE OPTIMISÉES
-- Permettent une recherche ultra-rapide par nom, prénom ou montant
-- sans les erreurs de 'logic tree' de Supabase
-- ============================================

-- VUE 1: liste_avances_recherchable
CREATE OR REPLACE VIEW liste_avances_recherchable 
WITH (security_invoker = true)
AS
SELECT 
    a.*,
    c.nom as client_nom,
    c.prenom as client_prenom,
    s.nom_societe as societe_nom_search,
    -- Création d'une colonne de recherche textuelle combinée
    LOWER(
        COALESCE(c.nom, '') || ' ' || 
        COALESCE(c.prenom, '') || ' ' || 
        COALESCE(s.nom_societe, '') || ' ' || 
        a.montant::text
    ) as search_text
FROM avance a
LEFT JOIN client c ON a.client_id = c.id
LEFT JOIN societe s ON a.societe_id = s.id
WHERE a.deleted_at IS NULL;

-- ============================================
-- VUE 2: liste_gasoil_recherchable
CREATE OR REPLACE VIEW liste_gasoil_recherchable 
WITH (security_invoker = true)
AS
SELECT 
    g.*,
    c.nom as client_nom,
    c.prenom as client_prenom,
    s.nom_societe as societe_nom_search,
    -- Création d'une colonne de recherche textuelle combinée
    LOWER(
        COALESCE(c.nom, '') || ' ' || 
        COALESCE(c.prenom, '') || ' ' || 
        COALESCE(s.nom_societe, '') || ' ' || 
        g.montant::text
    ) as search_text
FROM gasoil g
LEFT JOIN client c ON g.client_id = c.id
LEFT JOIN societe s ON g.societe_id = s.id
WHERE g.deleted_at IS NULL;