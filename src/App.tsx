import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react'; // 1. Import Suspense & lazy
import MainLayout from './components/layout/MainLayout';
import PageLayout from './components/layout/PageLayout';
import { Spinner } from '@/components/shared/ui'; // Import helper spinner

// 2. Lazy load pages - Code Splitting
const ClientsPage = lazy(() => import('./pages/clients'));
const SocietesPage = lazy(() => import('./pages/societes'));
const SocieteViewPage = lazy(() => import('./pages/societes/view'));
const AvancesPage = lazy(() => import('./pages/transactions/avances'));
const GasoilPage = lazy(() => import('./pages/transactions/gasoil'));
import ClientView from './pages/clients/view';

function App() {
  return (
    <MainLayout>
      {/* 3. Wrap Routes in Suspense with a fallback */}
      <Suspense fallback={
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <Spinner size="lg" />
        </div>
      }>
        <Routes>
          <Route path="/societes" element={<SocietesPage />} />
          <Route path="/societes/:id" element={<SocieteViewPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientView />} />
          <Route path="/paiements" element={<AvancesPage />} />
          <Route path="/gasoil" element={<GasoilPage />} />
          <Route path="/" element={
            <PageLayout
              title="Aperçu du Tableau de Bord"
              description="Gérez vos analyses, utilisateurs et paramètres à partir d'un seul endroit."
              variant="content"
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
      </Suspense>
    </MainLayout>
  );
}

export default App;
