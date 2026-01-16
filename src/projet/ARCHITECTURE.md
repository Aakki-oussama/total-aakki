# 🏗️ ARCHITECTURE FRONTEND - Mes Crédits

## 📁 Structure des Dossiers

```
src/
├── config/                    # ✅ DÉJÀ FAIT - Configuration centralisée
│   ├── app.ts                 # Nom, logo, description de l'app
│   ├── user.ts                # Utilisateur courant
│   ├── icons.ts               # Tailles et styles des icônes
│   └── navigation.ts          # Items du menu
│
├── context/                   # ✅ DÉJÀ FAIT - État global React
│   └── ThemeContext.tsx       # Thème clair/sombre
│
├── types/                     # 🆕 TYPES TYPESCRIPT
│   ├── index.ts               # Export central
│   ├── database.ts            # Types des tables Supabase
│   └── api.ts                 # Types pour les réponses API
│
├── lib/                       # 🆕 UTILITAIRES ET SERVICES
│   ├── supabase/
│   │   ├── client.ts          # Client Supabase configuré
│   │   └── helpers.ts         # Fonctions utilitaires (formatDate, etc.)
│   └── utils/
│       ├── format.ts          # Formatage (monnaie, dates)
│       └── validation.ts      # Validation des formulaires
│
├── hooks/                     # 🆕 HOOKS PERSONNALISÉS
│   ├── useClients.ts          # CRUD clients
│   ├── useSocietes.ts         # CRUD sociétés
│   ├── useEmployes.ts         # CRUD employés
│   ├── useVehicules.ts        # CRUD véhicules
│   ├── useAvances.ts          # Gestion des avances
│   ├── useTransactions.ts     # Historique des transactions
│   └── useRapports.ts         # Données des rapports/dashboard
│
├── components/                # COMPOSANTS RÉUTILISABLES
│   ├── layout/                # ✅ DÉJÀ FAIT
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── MainLayout.tsx
│   │   ├── PageLayout.tsx
│   │   └── Breadcrumbs.tsx
│   │
│   └── shared/                # 🆕 COMPOSANTS PARTAGÉS
│       ├── ui/                # Éléments de base
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Select.tsx
│       │   ├── Modal.tsx
│       │   ├── Card.tsx
│       │   ├── Badge.tsx
│       │   └── Spinner.tsx
│       │
│       ├── data/              # Affichage de données
│       │   ├── DataTable.tsx  # Tableau avec pagination, tri, recherche
│       │   ├── StatCard.tsx   # Carte statistique (Dashboard)
│       │   └── EmptyState.tsx # État vide "Aucune donnée"
│       │
│       └── forms/             # Formulaires
│           ├── FormField.tsx  # Wrapper pour champ + label + erreur
│           ├── SearchInput.tsx
│           └── DatePicker.tsx
│
├── features/                  # 🆕 MODULES PAR ENTITÉ
│   ├── clients/
│   │   ├── components/
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   └── ClientDetails.tsx
│   │   └── index.ts           # Export des composants
│   │
│   ├── societes/
│   │   ├── components/
│   │   │   ├── SocieteList.tsx
│   │   │   ├── SocieteForm.tsx
│   │   │   ├── EmployeList.tsx
│   │   │   └── VehiculeList.tsx
│   │   └── index.ts
│   │
│   ├── transactions/
│   │   ├── components/
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionDetails.tsx
│   │   └── index.ts
│   │
│   └── rapports/
│       ├── components/
│       │   ├── DashboardStats.tsx
│       │   ├── ImpayesList.tsx
│       │   ├── ChartAvances.tsx
│       │   └── TopConsommateurs.tsx
│       └── index.ts
│
└── pages/                     # 🆕 PAGES PRINCIPALES
    ├── Dashboard.tsx          # Page d'accueil avec statistiques
    ├── Clients.tsx            # Liste + CRUD clients
    ├── ClientDetail.tsx       # Détail d'un client
    ├── Societes.tsx           # Liste + CRUD sociétés
    ├── SocieteDetail.tsx      # Détail d'une société
    ├── Transactions.tsx       # Historique des transactions
    ├── Rapports.tsx           # Rapports et statistiques
    └── Settings.tsx           # Paramètres
```

---

## 🎨 SYSTÈME DE COULEURS

### Variables CSS (index.css) - ✅ DÉJÀ FAIT
```css
:root {
  --background: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
}

:root.dark {
  --background: #020617;
  --surface: #0f172a;
  --border: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}
```

### Utilisation dans les Composants
```tsx
// ✅ BON - Utiliser les classes sémantiques
className="bg-surface text-main border-border"
className="text-muted"
className="bg-background"

// ❌ MAUVAIS - Ne pas utiliser de couleurs hardcodées
className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
```

### Couleurs Spéciales
```tsx
// Statuts
className="text-green-500"   // Solde positif (AVANCE)
className="text-red-500"     // Solde négatif (CRÉDIT)
className="text-yellow-500"  // Attention/Warning

// Actions
className="bg-primary text-primary-foreground"  // Bouton principal
className="bg-muted/10 hover:bg-muted/20"       // Bouton secondaire
```

---

## 🔄 CONVENTION DES HOOKS

### Structure d'un Hook
```typescript
// hooks/useClients.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Client } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('view_clients_avec_solde')
      .select('*');
    
    if (error) setError(error.message);
    else setClients(data || []);
    setLoading(false);
  }, []);

  // Create client
  const createClient = async (client: Omit<Client, 'id'>) => { ... };

  // Update client
  const updateClient = async (id: string, client: Partial<Client>) => { ... };

  // Delete client (soft delete)
  const deleteClient = async (id: string) => { ... };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, createClient, updateClient, deleteClient, refetch: fetchClients };
}
```

---

## 📝 CONVENTION DES TYPES

### Structure des Types
```typescript
// types/database.ts

// Table: client
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// View: view_clients_avec_solde
export interface ClientAvecSolde extends Client {
  nom_complet: string;
  solde: number;
  statut: 'CREDIT' | 'AVANCE' | 'EQUILIBRE';
}

// Pour les formulaires
export type ClientFormData = Pick<Client, 'nom' | 'prenom'>;
```

---

## 📄 CONVENTION DES PAGES

### Structure d'une Page
```typescript
// pages/Clients.tsx
import { PageLayout } from '@/components/layout/PageLayout';
import { ClientList, ClientForm } from '@/features/clients';
import { useClients } from '@/hooks/useClients';
import { useState } from 'react';

export default function ClientsPage() {
  const { clients, loading, error, createClient, deleteClient } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PageLayout 
      title="Clients" 
      description="Gérez vos clients et leurs soldes"
      variant="content"
      onAdd={() => setIsModalOpen(true)}
    >
      <ClientList 
        clients={clients} 
        loading={loading}
        onDelete={deleteClient}
      />
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ClientForm onSubmit={createClient} />
      </Modal>
    </PageLayout>
  );
}
```

---

## ⚡ RÈGLES DE PERFORMANCE

1. **useMemo** : Pour les calculs lourds ou les filtres
```tsx
const filteredClients = useMemo(() => 
  clients.filter(c => c.nom.includes(search)),
  [clients, search]
);
```

2. **useCallback** : Pour les fonctions passées en props
```tsx
const handleDelete = useCallback((id: string) => {
  deleteClient(id);
}, [deleteClient]);
```

3. **Lazy Loading** : Pour les pages
```tsx
const ClientsPage = lazy(() => import('./pages/Clients'));
```

---

## 🚀 ORDRE D'IMPLÉMENTATION

### Phase 1: Fondations
1. [ ] `types/database.ts` - Types des tables
2. [ ] `lib/supabase/client.ts` - Client Supabase
3. [ ] `lib/utils/format.ts` - Utilitaires de formatage

### Phase 2: Composants Partagés
4. [ ] `components/shared/ui/Button.tsx`
5. [ ] `components/shared/ui/Input.tsx`
6. [ ] `components/shared/ui/Modal.tsx`
7. [ ] `components/shared/data/DataTable.tsx`
8. [ ] `components/shared/data/StatCard.tsx`

### Phase 3: Features (par ordre de priorité)
9. [ ] `features/clients/` - CRUD clients
10. [ ] `features/societes/` - CRUD sociétés
11. [ ] `features/transactions/` - Gestion transactions
12. [ ] `features/rapports/` - Dashboard et rapports

### Phase 4: Pages
13. [ ] `pages/Dashboard.tsx`
14. [ ] `pages/Clients.tsx`
15. [ ] `pages/Societes.tsx`
16. [ ] `pages/Transactions.tsx`
17. [ ] `pages/Rapports.tsx`

---

## ✅ CHECKLIST QUALITÉ

- [ ] Pas de couleurs hardcodées (utiliser les variables CSS)
- [ ] Pas de calculs de solde dans le frontend
- [ ] Types TypeScript stricts
- [ ] Hooks réutilisables
- [ ] Composants atomiques
- [ ] Gestion des erreurs (afficher les messages PostgreSQL)
- [ ] Loading states
- [ ] Empty states
- [ ] Responsive design
