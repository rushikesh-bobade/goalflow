import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '~/hooks/use-app-state';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Array<'employee' | 'manager' | 'admin'>;
}

/**
 * Guards a route — redirects to /login if not authenticated.
 * Optionally restricts access by role.
 */
export function RequireAuth({ children, allowedRoles }: Props) {
  const { currentUser, isAuthenticated, isHydrated } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
      // Redirect to user's own dashboard
      const dashboardMap = { employee: '/employee/dashboard', manager: '/manager/dashboard', admin: '/admin/dashboard' };
      navigate(dashboardMap[currentUser.role], { replace: true });
    }
  }, [isAuthenticated, isHydrated, currentUser, allowedRoles, navigate]);

  if (!isHydrated || !isAuthenticated) return null;
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) return null;

  return <>{children}</>;
}
