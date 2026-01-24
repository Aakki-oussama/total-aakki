CREATE OR REPLACE VIEW view_timeline_activite AS
SELECT 
    id,
    date_operation,
    type,
    description,
    montant,
    CASE 
        WHEN client_id IS NOT NULL THEN 'CLIENT'
        ELSE 'SOCIETE'
    END as type_entite,
    CASE 
        WHEN client_id IS NOT NULL THEN (SELECT CONCAT(nom, ' ', prenom) FROM client WHERE id = client_id)
        ELSE (SELECT nom_societe FROM societe WHERE id = societe_id)
    END as nom_entite,
    created_at
FROM (
    SELECT id, date_gasoil as date_operation, 'GASOIL' as type, 'Prise de Gasoil' as description, montant, client_id, societe_id, created_at FROM gasoil WHERE deleted_at IS NULL
    UNION ALL
    SELECT id, date_avance as date_operation, 'PAIEMENT' as type, 
        CASE WHEN mode_paiement = 'CHEQUE' THEN 'Paiement Chèque' ELSE 'Paiement Espèces' END as description, 
        montant, client_id, societe_id, created_at FROM avance WHERE deleted_at IS NULL
) all_ops
ORDER BY date_operation DESC, created_at DESC
LIMIT 50;