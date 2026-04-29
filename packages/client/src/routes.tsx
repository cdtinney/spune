import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './features/auth/UserContext';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import VisualizationPage from './pages/VisualizationPage';
import ErrorPage from './pages/ErrorPage';
import LoadingScreen from './components/LoadingScreen';
import type { ReactNode } from 'react';

interface RouteWrapperProps {
  children: ReactNode;
}

function PrivateRoute({ children }: RouteWrapperProps) {
  const { user, loading } = useUser();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: RouteWrapperProps) {
  const { user, loading } = useUser();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (user.userType !== 'admin') return <Navigate to="/visualization" replace />;
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
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route path="/error/:errorMsg" element={<ErrorPage />} />
    </Routes>
  );
}
