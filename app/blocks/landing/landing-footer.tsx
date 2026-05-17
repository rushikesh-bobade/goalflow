import { Link } from 'react-router';
import { IconBolt } from '@tabler/icons-react';
import styles from './landing-footer.module.css';

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <div className={styles.brandMark}><IconBolt size={18} stroke={2.4} /></div>
            <span className={styles.brandName}>AtomQuest</span>
          </div>
          <p className={styles.tagline}>Built for Atomberg Hackathon 2026.</p>
        </div>
        <div className={styles.right}>
          <Link to="/login" className={styles.link}>Sign In</Link>
          <a href="#features" className={styles.link}>Features</a>
          <a href="#how-it-works" className={styles.link}>How It Works</a>
        </div>
      </div>
      <div className={styles.copyright}>
        © 2026 Atomberg Technologies Pvt. Ltd. — v1.0.0 Hackathon Build
      </div>
    </footer>
  );
}
