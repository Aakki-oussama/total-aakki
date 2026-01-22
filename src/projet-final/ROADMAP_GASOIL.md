# ⛽ ROADMAP : SECTION GASOIL (DÉPENSES) V2

Ce document définit les étapes pour implémenter la gestion des consommations de carburant avec une précision maximale, en gérant les liens entre clients, sociétés, chauffeurs et véhicules.

---

## 🏗️ 1. COUCHE SERVICE (Logic & API)
*   **Fichier :** `src/features/transactions/services/gasoilService.ts`
*   **Objectif :** Gérer le CRUD du Gasoil et les interactions avec les soldes.
*   **Fonctionnalités Clés :** 
    *   `fetchGasoils` : Liste paginée avec jointures (Client, Société, Employé, Véhicule).
    *   `createGasoil` : Création standard.
    *   `deleteGasoil` : Utiliser la fonction SQL `soft_delete_gasoil` pour recalculer les soldes automatiquement.
*   **Qualité :** Typage strict avec `GasoilWithDetails`.

## 🎣 2. COUCHE HOOKS (State Management)
*   **Fichier :** `src/features/transactions/hooks/useGasoil.ts`
*   **Objectif :** Orchestrer les données via `useServerResource`.
*   **Spécificités :** 
    *   Gestion des filtres croisés (Date, Nom, Recherche).
    *   Intégration du système de Toasts (Succès/Erreur).

## 🖼️ 3. COUCHE UI (Composants)
### A. Le Tableau (`GasoilTable.tsx`)
*   **Réutilisation :** Basé sur `DataTable.tsx`.
*   **Colonnes :** Date, Bénéficiaire (Client ou Société), Détails (Chauffeur/Camion pour les sociétés), Montant.
*   **Design :** Icône de pompe à essence (Fuel) pour identifier les transactions.

### B. Le Formulaire Dynamique (`GasoilForm.tsx`)
*   **Logique de Condition :** 
    *   Si **Client** : Simple sélection du nom + Montant.
    *   Si **Société** : Sélection Société -> Apparition dynamique des listes de **ses** Chauffeurs et **ses** Véhicules.
*   **Vitesse :** Chargement "Lazy" des options pour éviter les lenteurs.

## 📄 4. COUCHE PAGE (Assemblage)
*   **Fichier :** `src/pages/transactions/gasoil.tsx`
*   **Structure :** `PageLayout` avec un design premium, Toolbar de recherche et filtre de date.

---

## 🛠️ POINTS DE VIGILANCE (GASOIL)
1.  **Le Solde Négatif :** Le Gasoil doit faire baisser le solde (`Solde = Avances - Gasoil`).
2.  **La Cohérence Société :** Empêcher de sélectionner un chauffeur de la "Société A" pour un véhicule de la "Société B".
3.  **Filtrage par Vue :** Utiliser une stratégie de recherche similaire à celle des Avances (via une Vue SQL) pour éviter les erreurs de "Logic Tree" sur les recherches par nom.

---

**Prêt à lancer l'étape 1 (Le Service) ?** ⛽🚀🫡
