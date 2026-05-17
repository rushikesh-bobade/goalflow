import { RequireAuth } from '~/components/require-auth/require-auth';
import { AppShell } from '~/blocks/__global/app-shell';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Array<'employee' | 'manager' | 'admin'>;
}

/**
 * Wraps a route in auth-guard + app shell (sidebar + topbar).
 */
export function AuthenticatedPage({ children, allowedRoles }: Props) {
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
