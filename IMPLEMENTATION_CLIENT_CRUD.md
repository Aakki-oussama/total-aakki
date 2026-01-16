# Implementation Plan: Client CRUD (Senior & Feature-Based Architecture)

This document outlines the steps and architecture for implementing the Client management section. The goal is to ensure **zero redundancy**, **high performance**, and a **premium UX** using modals.

## 1. Architecture Overview (Feature-Driven)

We follow a **Feature-based** structure where all client-specific logic lives inside the `features/clients` folder, keeping `pages` simple.

| Layer | Responsibility | File(s) |
| :--- | :--- | :--- |
| **Services (API)** | Pure Supabase functions (No UI logic). | `src/features/clients/services/clientService.ts` |
| **Logic (Hooks)** | Manages state, modals, and data fetching. | `src/features/clients/hooks/useClients.ts` |
| **Components** | UI pieces for the feature (Form, Table). | `src/features/clients/components/ClientForm.tsx` |
| **Page Entry** | Connects the feature to the route. | `src/pages/clients/index.tsx` |

---

## 2. Implementation Steps

### Step 1: Services (Data Layer)
Create `src/features/clients/services/clientService.ts`:
- `fetchClients()`: Get all active clients.
- `createClient(data)`: Insert new client.
- `updateClient(id, data)`: Update existing client.
- `deleteClient(id)`: Soft delete or hard delete.

### Step 2: Custom Hook (State Layer)
Create `src/features/clients/hooks/useClients.ts`:
- Logic for `loading`, `data`, and `error`.
- State for `isModalOpen`, `isDeleteModalOpen`, and `selectedClient`.
- Handlers for `onAdd`, `onEdit`, `onDelete`.

### Step 3: Feature Components
- `src/features/clients/components/ClientForm.tsx`: One form for Add/Edit logic.
- `src/features/clients/components/ClientTable.tsx`: Uses `DataTable` and `TableActions`.

### Step 4: Page Index
Create `src/pages/clients/index.tsx`:
- Imports the feature components.
- Uses `PageLayout` with "Ajouter Client" in the header.
- Main entry point for the `/clients` route.

---

## 3. Revised File Structure

```text
src/
├── features/
│   └── clients/
│       ├── components/
│       │   ├── ClientForm.tsx
│       │   └── ClientTable.tsx
│       ├── hooks/
│       │   └── useClients.ts
│       └── services/
│           └── clientService.ts
└── pages/
    └── clients/
        └── index.tsx          # Main entry route
```

---

## 4. Senior Principles (Checklist)

1.  **Shared Form**: Use the same `ClientForm` for adding and editing to prevent double maintenance.
2.  **No Direct API in UI**: Components must use the `useClients` hook or `clientService`, never `supabase` directly.
3.  **Typed Data**: Use the types from `src/types/tables.ts` correctly.
4.  **UX Flow**:
    - Smooth opening of the `Modal`.
    - Auto-refreshing list after a successful action (Optimistic).
    - Clear validation messages.

---

**Next Step**: Please confirm if this structure matches your vision. If yes, we can start by creating the folders and the Service layer. Okey?
