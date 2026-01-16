## 🤖 INSTRUCTIONS POUR L'IA - Application Gestion Crédits Gasoil

### CONTEXTE:
J'ai une base de données Supabase (PostgreSQL) avec ces éléments déjà créés:
- **Tables**: client, societe, employe, vehicule, avance, transaction
- **Triggers automatiques** pour calculer les soldes
- **Views pour rapports**: view_impayes, view_avances_par_mois, view_clients_avec_solde, etc.
- **Materialized views pour performance**: mat_avances_par_jour, mat_credits_par_mois, etc.

### FRONTEND:
Application web **React + TypeScript (SPA)** qui utilise Supabase JavaScript Client.

---

### RÈGLES IMPORTANTES:

1. **Je ne fais JAMAIS de calculs de solde dans le frontend** - les triggers le font automatiquement
2. **Pour INSERT transaction**: je fournis juste `avance_id`, `type_transaction`, `montant`, `mode_paiement`
3. **Les champs `solde_apres` et `solde_actuel`** sont calculés AUTO par la base de données
4. **Pour les rapports**, j'utilise les VIEWS et MATERIALIZED VIEWS (pas de calculs manuels)
5. **Pour soft delete**: je fais `UPDATE ... SET deleted_at = NOW()` (pas DELETE)
6. **Pour refresh les materialized views**: Le trigger le fait auto, mais on peut forcer avec `SELECT refresh_all_materialized_views()`
7. **Pour les erreurs Supabase**: Toujours afficher le message d'erreur PostgreSQL à l'utilisateur (ex: "Le numéro de chèque est obligatoire")

---

### EXEMPLES DE CE QUE LE FRONTEND DOIT FAIRE:

```typescript
// Afficher liste clients avec leur solde
const { data } = await supabase.from('view_clients_avec_solde').select('*')

// Afficher impayés
const { data } = await supabase.from('view_impayes').select('*')

// Afficher avances du mois
const { data } = await supabase.from('mat_avances_par_mois').select('*').eq('mois_format', '2026-01')

// Ajouter transaction
const { error } = await supabase.from('transaction').insert({
  avance_id: '...',
  type_transaction: 'AVANCE',
  montant: 500,
  mode_paiement: 'CASH'
})

// Supprimer client (soft delete)
const { error } = await supabase.from('client').update({ deleted_at: new Date().toISOString() }).eq('id', 'xxx')

// Gérer les erreurs
if (error) {
  toast.error(error.message) // Affiche le message PostgreSQL
}
```

---

### ❌ NE JAMAIS:

- Calculer les soldes dans le frontend
- Faire des boucles pour recalculer des totaux
- Utiliser localStorage/sessionStorage pour stocker des données métier
- Faire du DELETE directement (toujours soft delete avec UPDATE)
- Ignorer les messages d'erreur de Supabase/PostgreSQL

---

### ✅ TOUJOURS:

- Utiliser les VIEWS pour les listes complexes
- Afficher les erreurs PostgreSQL à l'utilisateur
- Utiliser TypeScript avec des types stricts
- Utiliser les hooks React (useState, useEffect, useMemo, useCallback) correctement
- Suivre les conventions React 19+ (pas de `import React`)