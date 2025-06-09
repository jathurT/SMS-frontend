import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { Loader } from 'lucide-react';

/**
 * ProtectedRoute component to restrict access based on authentication and roles.
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
    requireAnyRole?: boolean; // If true, user needs ANY of the roles, if false, ALL roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    roles = [],
    requireAnyRole = true
}) => {
    const { isAuthenticated, hasRole, hasAnyRole, loading } = useAuth();

    if (loading) {
        return <Loader className="animate-spin h-6 w-6 text-gray-500 mx-auto" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (roles.length > 0) {
        const hasAccess = requireAnyRole
            ? hasAnyRole(roles)
            : roles.every(role => hasRole(role));

        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;