# 🏦 ROADMAP : SECTION AVANCES (PAIEMENTS) V2

Ce document définit les étapes pour implémenter la gestion des paiements avec une qualité de code maximale, sans redondance, en réutilisant l'architecture existante.

---

## 🏗️ 1. COUCHE SERVICE (Logic & API)
*   **Fichier :** `src/features/transactions/services/avanceService.ts`
*   **Objectif :** Utiliser `baseService` pour le CRUD classique et ajouter les appels RPC pour la "Création Rapide".
*   **Qualité :** 
    *   Zéro duplication de logique de pagination (réutilise `queryHelpers`).
    *   Typage strict avec les interfaces de `tables.ts`.

## 🎣 2. COUCHE HOOKS (State Management)
*   **Fichier :** `src/features/transactions/hooks/useAvances.ts`
*   **Objectif :** Utiliser le hook générique `useServerResource`.
*   **Qualité :** 
    *   On ne réécrit pas la gestion des erreurs ou du chargement.
    *   On utilise `useMemo` pour les configurations de fetch.

## 🖼️ 3. COUCHE UI (Composants)
### A. Le Tableau (`AvanceTable.tsx`)
*   **Réutilisation :** Utiliser `DataTable.tsx` (le composant générique du projet).
*   **Syntaxe :** Définition des colonnes via `useMemo` comme dans `ClientTable`.
*   **Aesthétique :** Badges colorés pour le mode de paiement (Badge Indigo pour Chèque, Émeraude pour Cash).

### B. Le Formulaire Intelligent (`AvanceForm.tsx`)
*   **Fonctionnalité "2-en-1" :** 
    *   Un sélecteur pour choisir un client/société existant.
    *   Un mode "Nouveau" qui affiche des champs Input simples.
*   **Logique :** Le formulaire décide dynamiquement quel service appeler au `onSubmit`.
*   **Qualité :** Pattern "Zero useEffect" pour l'initialisation du state.

## 📄 4. COUCHE PAGE (Assemblage)
*   **Fichier :** `src/pages/transactions/avances.tsx`
*   **Structure :** `PageLayout` avec bouton "Enregistrer un paiement".
*   **SEO :** Titres et Meta descriptions intégrés.

---

## 🛠️ PRINCIPES DE CODAGE (RAPPEL)
1.  **Zéro Redondance :** Si une fonction de calcul existe en SQL, on ne la refait pas en JS.
2.  **Composants Partagés :** On utilise `Button`, `Input`, `Select`, `Modal` du dossier `@/components/shared/ui`.
3.  **Clean Code :** Commentaires JSDoc sur chaque service et composant majeur.
4.  **Fast Refresh :** Export unique des composants pour ne pas casser le HMR de Vite.

---
**Prêt à lancer l'étape 1 ?** 🚀
