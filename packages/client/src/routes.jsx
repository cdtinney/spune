import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import HomePage from './pages/HomePage';
import VisualizationPage from './pages/VisualizationPage';
import ErrorPage from './pages/ErrorPage';

function PrivateRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
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
