# Plan de Nettoyage : Suppression "Chauffeur" & "Matricule"

Ce document répertorie tous les fichiers et blocs de code à supprimer pour simplifier l'application.

## 1. Fichiers à supprimer COMPLÈTEMENT (Terminé ✅)

### Services & Hooks
- [x] `src/features/societes/services/employeService.ts`
- [x] `src/features/societes/services/vehiculeService.ts`
- [x] `src/features/societes/hook/useEmployes.ts`
- [x] `src/features/societes/hook/useVehicules.ts`

### Composants UI (Sociétés)
- [x] `src/features/societes/components/tables/EmployeTable.tsx`
- [x] `src/features/societes/components/tables/VehiculeTable.tsx`
- [x] `src/features/societes/components/forms/VehiculeForm.tsx`
- [x] `src/features/societes/components/forms/parts/EmployeSection.tsx`
- [x] `src/features/societes/components/forms/parts/VehiculeSection.tsx`
- [x] `src/features/societes/components/view/parts/ViewTabs.tsx`

---

## 2. Prochaines Étapes : Nettoyage & Adaptation (En cours 🏗️)

### A. Réparation des Imports Brisés
- [ ] Nettoyer `src/features/societes/components/view/parts/ViewModals.tsx` (Supprimer refs vers employes/vehicules)
- [ ] Nettoyer `src/features/societes/components/view/SocieteViewContainer.tsx` (Supprimer onglets et hooks morts)
- [ ] Nettoyer `src/features/societes/components/forms/SocieteForm.tsx` (Vérifier s'il y a des liens vers les sections supprimées)

### B. Harmonisation Vue Société (Miroir du Client)
- [ ] Créer `useSocieteHistory` hook (similaire au client).
- [ ] Créer `useSocieteDetails` hook.
- [ ] Intégrer `HistoryTable` et `HistoryExport` dans la vue société.

### C. Nettoyage des Types & Services de Données
- [ ] `src/types/tables.ts` & `src/types/views.ts` : Retirer `employe_id` et `vehicule_id`.
- [ ] `src/features/transactions/services/gasoilService.ts` : Retirer les jointures inutiles.

---

## 3. Déjà Fait (Ailleurs)
- [x] **`GasoilForm.tsx`** : Champs de saisie supprimés.
- [x] **`useGasoilForm.ts`** : Logique de chargement supprimée.
- [x] **`GasoilTable.tsx`** : Colonne "Logistique" supprimée.
