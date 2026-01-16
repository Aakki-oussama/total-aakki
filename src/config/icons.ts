
export const iconConfig = {
    strokeWidth: 1.5,
    sizes: {
        // --- Navigation & Layout ---
        sidebar: "w-6 h-6",       // Menu latéral principal
        header: "w-5 h-5",        // Icônes de l'en-tête (Profil, Notifications)
        mobile: "w-6 h-6",        // Icônes spécifiques à la navigation mobile
        breadcrumb: "w-4 h-4",    // Fil d'ariane et petits indicateurs

        // --- Actions & Buttons ---
        action: "w-5 h-5",        // Icônes dans les boutons d'action (ex: "Ajouter")
        actionButton: "h-9 w-9",  // Taille des boutons d'action circulaires/carrés
        xs: "w-3.5 h-3.5",        // Icônes très petites (ex: Fermer un badge)

        // --- Branding ---
        logo: "w-6 h-6",          // Logo principal
        logoMobile: "w-4 h-4",    // Logo miniaturisé

        // --- States & Utilities ---
        emptyState: "w-10 h-10",   // Grandes icônes pour les listes vides

        // --- UI Square Components (Pagination, Selectors, etc.) ---
        square: "w-8 h-8",        // Taille standard carrée pour mobile
        squareDesktop: "w-8 h-8", // Taille standard carrée pour desktop
    },
    transitions: "transition-all duration-300 ease-in-out",
};
