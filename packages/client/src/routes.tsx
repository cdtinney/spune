import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './features/auth/UserContext';
import HomePage from './pages/HomePage';
import VisualizationPage from './pages/VisualizationPage';
import ErrorPage from './pages/ErrorPage';
import LoadingScreen from './components/LoadingScreen';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useUser();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/visualization"
        element={
          <PrivateRoute>
            <VisualizationPage />
          </PrivateRoute>
        }
      />
      <Route path="/error/:errorMsg" element={<ErrorPage />} />
    </Routes>
  );
}
