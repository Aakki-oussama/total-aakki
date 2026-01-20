-- VUE: liste_avances_recherchable
-- Permet une recherche ultra-rapide par nom, prénom ou montant
-- sans les erreurs de 'logic tree' de Supabase

CREATE OR REPLACE VIEW liste_avances_recherchable AS
SELECT 
    a.*,
    c.nom as client_nom,
    c.prenom as client_prenom,
    s.nom_societe as societe_nom_search,
    -- Création d'une colonne de recherche textuelle combinée
    COALESCE(c.nom, '') || ' ' || COALESCE(c.prenom, '') || ' ' || COALESCE(s.nom_societe, '') || ' ' || a.montant::text as search_text
FROM avance a
LEFT JOIN client c ON a.client_id = c.id
LEFT JOIN societe s ON a.societe_id = s.id
WHERE a.deleted_at IS NULL;