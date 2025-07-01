import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && error && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [loading, error, isAuthenticated, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;