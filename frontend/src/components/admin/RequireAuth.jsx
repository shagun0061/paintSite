import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { Spinner } from '../ui/States.jsx';

export function RequireAuth({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();
  if (checking) return <Spinner label="Checking your session…" className="min-h-dvh" />;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}
