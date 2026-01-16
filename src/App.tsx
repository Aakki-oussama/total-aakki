import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PageLayout from './components/layout/PageLayout';
import ClientsPage from './pages/clients';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/" element={
          <PageLayout
            title="Aperçu du Tableau de Bord"
            description="Gérez vos analyses, utilisateurs et paramètres à partir d'un seul endroit."
            variant="content"
            onAdd={() => alert("Ajouter cliqué !")}
          >
            <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-main">Bienvenue sur votre Dashboard</h2>
              <p className="text-muted text-lg">
                La structure est complète avec Barre latérale + En-tête + Contenu de page. Toutes les couleurs sont maintenant parfaitement standardisées.
              </p>
            </div>
          </PageLayout>
        } />

        <Route path="/:id" element={
          <PageLayout
            title="Navigation Active !"
            description="L'URL est maintenant la source de vérité."
            variant="content"
            onAdd={() => { }}
          >
            <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-main">Contenu de la Page Chargé</h2>
              <p className="text-muted text-lg">
                Notez que les icônes sont mises en évidence correctement sur tous les appareils et le mode sombre change automatiquement.
              </p>
            </div>
          </PageLayout>
        } />
      </Routes>
    </MainLayout>
  );
}

export default App;
