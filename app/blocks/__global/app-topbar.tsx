import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  IconBell, IconChevronDown, IconLogout, IconUser,
  IconLayoutDashboard, IconShieldLock, IconCheck
} from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import styles from './app-topbar.module.css';

function getPhaseLabel(phase: string): string {
  const map: Record<string, string> = {
    goal_setting: 'Goal Setting Phase',
    q1: 'Q1 Check-in Phase',
    q2: 'Q2 Check-in Phase',
    q3: 'Q3 Check-in Phase',
    q4: 'Q4 Check-in Phase',
  };
  return map[phase] ?? phase;
}

function getDaysRemaining(closeDate: string): number {
  return Math.max(0, Math.floor((new Date(closeDate).getTime() - Date.now()) / 86400000));
}

function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    '/employee/dashboard': 'My Dashboard',
    '/employee/goals/new': 'Create New Goal',
    '/employee/checkin': 'Quarterly Check-in',
    '/manager/dashboard': 'Team Dashboard',
    '/manager/approvals': 'Goal Approvals',
    '/manager/checkin': 'Check-in Review',
    '/admin/dashboard': 'Admin Control Center',
    '/admin/users': 'Users & Hierarchy',
    '/admin/escalations': 'Escalation Rules',
    '/admin/audit': 'Audit Trail',
    '/admin/reports': 'Reports & Analytics',
  };
  if (routes[pathname]) return routes[pathname];
  if (pathname.startsWith('/employee/goals/')) return 'Goal Details';
  if (pathname.startsWith('/manager/team/')) return 'Team Member Goals';
  return 'AtomQuest';
}

export function AppTopbar() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, goalCycles, logout } = useAppState();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeCycle = goalCycles.find(c => c.isActive);
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = myNotifs.filter(n => !n.isRead).length;
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function handleNotifClick(n: typeof myNotifs[0]) {
    markNotificationRead(n.id);
    setShowNotif(false);
    if (n.deepLink) navigate(n.deepLink);
  }

  function handleLogout() {
    setShowMenu(false);
    logout();
    navigate('/login', { replace: true });
  }

  const roleIcons = { employee: IconUser, manager: IconLayoutDashboard, admin: IconShieldLock };
  const RoleIcon = currentUser ? roleIcons[currentUser.role] : IconUser;

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        {activeCycle && (
          <div className={styles.cycleBadge}>
            <span className={styles.cyclePulse} />
            <span>{activeCycle.name}</span>
            <span className={styles.cycleSep}>•</span>
            <span className={styles.cyclePhase}>{getPhaseLabel(activeCycle.phase)}</span>
            <span className={styles.cycleSep}>•</span>
            <span className={styles.cycleDays}>{getDaysRemaining(activeCycle.windowClose)}d remaining</span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div ref={notifRef} className={styles.notifWrap}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotif(p => !p)}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <IconBell size={18} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
          {showNotif && (
            <div className={styles.notifPanel}>
              <div className={styles.notifHeader}>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className={styles.markAllBtn} onClick={markAllNotificationsRead}>
                    <IconCheck size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className={styles.notifList}>
                {myNotifs.length === 0 ? (
                  <div className={styles.notifEmpty}>You're all caught up!</div>
                ) : (
                  myNotifs.slice(0, 8).map(n => (
                    <button
                      key={n.id}
                      className={`${styles.notifItem} ${n.isRead ? styles.notifItemRead : ''}`}
                      onClick={() => handleNotifClick(n)}
                    >
                      {!n.isRead && <span className={styles.notifDot} />}
                      <div className={styles.notifBody}>
                        <div className={styles.notifTitle}>{n.title}</div>
                        <div className={styles.notifMsg}>{n.message}</div>
                        <div className={styles.notifTime}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {currentUser && (
          <div ref={menuRef} className={styles.userWrap}>
            <button className={styles.userBtn} onClick={() => setShowMenu(p => !p)}>
              <div className={styles.avatar}>{currentUser.avatarInitials}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{currentUser.name}</span>
                <span className={styles.userRole}><RoleIcon size={10} /> {currentUser.role}</span>
              </div>
              <IconChevronDown size={14} className={styles.chevron} />
            </button>
            {showMenu && (
              <div className={styles.menuPanel}>
                <div className={styles.menuHeader}>
                  <div className={styles.menuAvatar}>{currentUser.avatarInitials}</div>
                  <div className={styles.menuInfo}>
                    <div className={styles.menuName}>{currentUser.name}</div>
                    <div className={styles.menuEmail}>{currentUser.email}</div>
                  </div>
                </div>
                <Link to="/admin/audit" className={styles.menuItem} onClick={() => setShowMenu(false)}>
                  <IconShieldLock size={14} /> Activity & audit
                </Link>
                <div className={styles.menuDivider} />
                <button className={`${styles.menuItem} ${styles.menuLogout}`} onClick={handleLogout}>
                  <IconLogout size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
