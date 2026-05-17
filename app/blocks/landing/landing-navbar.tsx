import { Link, useNavigate } from 'react-router';
import { IconBolt, IconArrowRight } from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import styles from './landing-navbar.module.css';

export function LandingNavbar() {
  const { currentUser } = useAppState();
  const navigate = useNavigate();

  function handleGoToApp() {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const dashboards = { employee: '/employee/dashboard', manager: '/manager/dashboard', admin: '/admin/dashboard' };
    navigate(dashboards[currentUser.role]);
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <div className={styles.brandMark}><IconBolt size={20} stroke={2.4} /></div>
        <span className={styles.brandName}>AtomQuest</span>
      </Link>
      <div className={styles.links}>
        <a href="#features" className={styles.link}>Features</a>
        <a href="#how-it-works" className={styles.link}>How It Works</a>
        <a href="#roles" className={styles.link}>For Teams</a>
      </div>
      <button className={styles.cta} onClick={handleGoToApp}>
        {currentUser ? 'Go to App' : 'Sign In'}
        <IconArrowRight size={14} />
      </button>
    </nav>
  );
}
