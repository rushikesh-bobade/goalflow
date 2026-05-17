import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import {
  IconLayoutDashboard, IconTarget, IconCalendarCheck, IconClipboardCheck,
  IconUsersGroup, IconRecycle, IconSettings, IconShieldLock, IconHistory,
  IconChartBar, IconBolt, IconChevronLeft, IconChevronRight, IconUserCog
} from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import styles from './app-sidebar.module.css';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  employee: [
    { to: '/employee/dashboard', label: 'My Dashboard', icon: IconLayoutDashboard },
    { to: '/employee/goals/new', label: 'Create Goal', icon: IconTarget },
    { to: '/employee/checkin', label: 'Quarterly Check-in', icon: IconCalendarCheck },
  ],
  manager: [
    { to: '/manager/dashboard', label: 'Team Dashboard', icon: IconLayoutDashboard },
    { to: '/manager/approvals', label: 'Goal Approvals', icon: IconClipboardCheck },
    { to: '/manager/checkin', label: 'Check-in Review', icon: IconCalendarCheck },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: IconLayoutDashboard },
    { to: '/admin/users', label: 'Users & Hierarchy', icon: IconUsersGroup },
    { to: '/admin/escalations', label: 'Escalation Rules', icon: IconRecycle },
    { to: '/admin/audit', label: 'Audit Trail', icon: IconHistory },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: IconChartBar },
  ],
};

export function AppSidebar() {
  const { currentUser } = useAppState();
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null;
  const items = NAV_BY_ROLE[currentUser.role] ?? [];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <Link to="/" className={styles.brand}>
        <div className={styles.brandMark}>
          <IconBolt size={22} stroke={2.4} />
        </div>
        {!collapsed && (
          <div className={styles.brandText}>
            <span className={styles.brandName}>AtomQuest</span>
            <span className={styles.brandSub}>Goal Portal 2026</span>
          </div>
        )}
      </Link>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {!collapsed && <div className={styles.navHeading}>Workspace</div>}
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} stroke={1.8} className={styles.navIcon} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(p => !p)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
