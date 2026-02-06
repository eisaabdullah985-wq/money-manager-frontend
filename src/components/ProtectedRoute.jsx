import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use the new hook

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Clean and simple

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;