import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        console.log('Not authorized, redirecting to admin login');
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute; 