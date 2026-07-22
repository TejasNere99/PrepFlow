import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8"><LoadingSkeleton rows={3} /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
