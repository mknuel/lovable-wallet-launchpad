
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATH_AUTH } from './paths';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoading } = useAuth();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }
  
  // Only redirect after loading is complete and we know the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={PATH_AUTH} state={{ from: location }} replace />;
  }
   
  return children;
};

export default ProtectedRoute;
