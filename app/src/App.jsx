import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Contas from './pages/Contas';
import Graficos from './pages/Graficos';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div data-theme="light">
      <AuthProvider>
        <BrowserRouter
          future={{ //TODO: Revisar isso posteriormente
            v7_relativeSplatPath: true,
            v7_startTransition: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/contas" replace />} />
              <Route path="contas" element={<Contas />} />
              <Route path="graficos" element={<Graficos />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
