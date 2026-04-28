import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  if (loading) return <div className="text-center py-12">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}











