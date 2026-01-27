import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from './components/layout/MainLayout';
import PageLayout from './components/layout/PageLayout';
import { Spinner } from '@/components/shared/ui';

// Auth & Protection
import ProtectedRoute from './features/auth/ProtectedRoute';
import LoginPage from './pages/login/Login';

// Pages
import DashboardPage from './pages/dashboard';
import ClientsPage from './pages/clients';
const SocietesPage = lazy(() => import('./pages/societes'));
const SocieteViewPage = lazy(() => import('./pages/societes/view'));
const AvancesPage = lazy(() => import('./pages/transactions/avances'));
const GasoilPage = lazy(() => import('./pages/transactions/gasoil'));
const ClientView = lazy(() => import('./pages/clients/view'));

function App() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Spinner size="lg" />
      </div>
    }>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientView />} />
                <Route path="/societes" element={<SocietesPage />} />
                <Route path="/societes/:id" element={<SocieteViewPage />} />
                <Route path="/paiements" element={<AvancesPage />} />
                <Route path="/gasoil" element={<GasoilPage />} />

                {/* Catch-all for sub-routes or 404 */}
                <Route path="/:id" element={
                  <PageLayout
                    title="Navigation"
                    description="Page en cours de chargement..."
                    variant="content"
                  >
                    <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm">
                      <h2 className="text-xl font-bold mb-4 text-main">Chargement...</h2>
                    </div>
                  </PageLayout>
                } />

                {/* Redirect if nothing matches under the protected path */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  );
}

export default App;
