📊 1. Views (viewrapport-final.md)
Status: ⚠️ MOSTLY UNUSED (Only 2 out of 15 are used)

View Name	Used?	Where?	Notes
view_dashboard_global	✅ YES	dashboardService.ts	Main dashboard stats
view_impayes	✅ YES	dashboardService.ts	Debt split calc
view_clients_avec_solde	❌ NO	-	Code uses client table + join
view_societes_avec_solde	❌ NO	-	Code uses societe table + join
view_historique_avances	❌ NO	-	Code uses liste_avances
view_historique_gasoil	❌ NO	-	Code uses liste_gasoil
view_avances_par_jour	❌ NO	-	Not used in charts yet
view_avances_par_semaine	❌ NO	-	"
view_avances_par_mois	❌ NO	-	"
view_gasoil_par_jour	❌ NO	-	"
view_gasoil_par_semaine	❌ NO	-	"
view_gasoil_par_mois	❌ NO	-	"
view_consommation_employe	❌ NO	-	"
view_top_employes_mois	❌ NO	-	"
view_recherche_cheques	❌ NO	-	"
⚡ 2. Functions (function-final.md)
Status: 🟢 MOSTLY USED (8 out of 10 used)

Function Name	Used?	Where?	Notes
create_client_avec_solde	✅ YES	avanceService.ts	Fast create
create_societe_avec_solde	✅ YES	avanceService.ts	Fast create
soft_delete_avance	✅ YES	avanceService.ts	Deletion logic
soft_delete_gasoil	✅ YES	gasoilService.ts	Deletion logic
get_stats_client	✅ YES	soldeService.ts	Updates stats
get_stats_societe	✅ YES	soldeService.ts	Updates stats
recalculer_solde_client	✅ YES	Triggers	Used by DB triggers
recalculer_solde_societe	✅ YES	Triggers	Used by DB triggers
restore_avance	❌ NO	-	No "Restore" button UI
restore_gasoil	❌ NO	-	No "Restore" button UI
🔍 3. Search Views (search.md)
Status: 🟢 FULLY USED (2 out of 2 used)

View Name	Used?	Where?	Notes
liste_avances_recherchable	✅ YES	avanceService.ts	Main list
liste_gasoil_recherchable	✅ YES	gasoilService.ts	Main list (we just added this)
🐇 4. Triggers (trigger-final.md)
Status: 🟢 ACTIVE Triggers (like trg_after_insert_avance, recacluate_solde) run automatically in the database. Even though your React code doesn't "call" them, they are ESSENTIAL for keeping your solde table correct. Do not remove them.

🚀 5. Optimization (optimisation-final.md)
Status: 🔴 COMPLETELY UNUSED

These "Materialized Views" are defined in your project, but ZERO code in your application actually queries them.

Mat View Name	Used?	Notes
mat_avances_par_jour	❌ NO	Dashboard uses standard live view
mat_avances_par_mois	❌ NO	"
mat_gasoil_par_jour	❌ NO	"
mat_gasoil_par_mois	❌ NO	"
refresh_all_...	❌ NO	Nothing calls this function
