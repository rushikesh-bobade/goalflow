import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  IconUser, IconLayoutDashboard, IconShieldLock, IconArrowLeft,
  IconBolt, IconCheck
} from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import styles from './login.module.css';

export function meta() {
  return [{ title: 'Sign In — AtomQuest' }];
}

const ROLES = [
  {
    id: 'emp-1',
    label: 'Employee',
    name: 'Rushikesh Bobade',
    department: 'Sales',
    email: 'employee@atomberg.com',
    description: 'Create personal goals, track quarterly progress, and submit check-ins.',
    icon: IconUser,
    redirect: '/employee/dashboard',
    color: '#3B82F6',
    perks: ['Up to 8 goals', '4 UoM types', 'Live weightage', 'Quarterly check-ins'],
  },
  {
    id: 'mgr-1',
    label: 'Manager',
    name: 'Priya Sharma',
    department: 'Sales',
    email: 'manager@atomberg.com',
    description: 'Review and approve team goals, monitor progress, comment on check-ins.',
    icon: IconLayoutDashboard,
    redirect: '/manager/dashboard',
    color: '#22C55E',
    perks: ['Approve / rework', 'Team heatmap', 'Inline edits', 'Comment per goal'],
  },
  {
    id: 'admin-1',
    label: 'Admin',
    name: 'Admin User',
    department: 'HR',
    email: 'admin@atomberg.com',
    description: 'Manage cycles, push shared goals, configure escalations, view analytics.',
    icon: IconShieldLock,
    redirect: '/admin/dashboard',
    color: '#FF6B2B',
    perks: ['Cycle control', 'Shared goals', 'Audit trail', 'Org analytics'],
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, currentUser } = useAppState();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState<string | null>(null);

  // Auto-redirect if already authenticated
  if (isAuthenticated && currentUser) {
    const dashboards = { employee: '/employee/dashboard', manager: '/manager/dashboard', admin: '/admin/dashboard' };
    navigate(dashboards[currentUser.role], { replace: true });
  }

  function handleLogin(roleId: string, redirect: string) {
    setSigningIn(roleId);
    // Small delay for visual feedback
    setTimeout(() => {
      const user = login(roleId);
      if (user) navigate(redirect, { replace: true });
    }, 350);
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb} />
      <Link to="/" className={styles.backLink}>
        <IconArrowLeft size={14} /> Back to home
      </Link>

      <div className={styles.inner}>
        <div className={styles.heroSide}>
          <Link to="/" className={styles.brand}>
            <div className={styles.brandMark}><IconBolt size={20} stroke={2.4} /></div>
            <span className={styles.brandName}>AtomQuest</span>
          </Link>
          <h1 className={styles.title}>Welcome back.</h1>
          <p className={styles.subtitle}>
            This is a hackathon demo — pick a role below to instantly explore the dashboard
            seeded with realistic data. No password required.
          </p>
          <div className={styles.featureList}>
            <div className={styles.featItem}><IconCheck size={14} /> Three pre-seeded demo personas</div>
            <div className={styles.featItem}><IconCheck size={14} /> Persistent session across reloads</div>
            <div className={styles.featItem}><IconCheck size={14} /> Live data, score engine, and notifications</div>
          </div>
        </div>

        <div className={styles.cardsSide}>
          <div className={styles.cardsHeader}>
            <h2 className={styles.cardsHeading}>Choose a role to continue</h2>
            <p className={styles.cardsSub}>One-click demo access</p>
          </div>
          <div className={styles.cards}>
            {ROLES.map(role => {
              const isLoading = signingIn === role.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  className={`${styles.roleCard} ${isLoading ? styles.roleCardLoading : ''}`}
                  style={{ '--role-color': role.color } as React.CSSProperties}
                  onClick={() => handleLogin(role.id, role.redirect)}
                  disabled={!!signingIn}
                >
                  <div className={styles.roleHead}>
                    <div className={styles.roleIcon}>
                      <Icon size={22} stroke={1.6} />
                    </div>
                    <div className={styles.roleMeta}>
                      <span className={styles.roleLabel}>{role.label}</span>
                      <span className={styles.roleName}>{role.name} • {role.department}</span>
                    </div>
                  </div>
                  <p className={styles.roleDesc}>{role.description}</p>
                  <div className={styles.rolePerks}>
                    {role.perks.map(p => (
                      <span key={p} className={styles.rolePerk}>{p}</span>
                    ))}
                  </div>
                  <div className={styles.roleFoot}>
                    {isLoading ? (
                      <><span className={styles.spinner} /> Signing in…</>
                    ) : (
                      <>Continue as {role.label} →</>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className={styles.disclaimer}>
            Demo build for Atomberg Hackathon 2026. No real authentication — sessions are local-storage only.
          </p>
        </div>
      </div>
    </div>
  );
}
