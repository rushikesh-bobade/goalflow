import { Link } from 'react-router';
import { IconArrowRight, IconBolt, IconSparkles } from '@tabler/icons-react';
import styles from './landing-hero.module.css';

export function LandingHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgOrb} />
      <div className={styles.bgGrid} />

      <div className={styles.inner}>
        <div className={styles.tagline}>
          <IconSparkles size={14} />
          <span>FY 2025-26 — Goal Setting Cycle is Live</span>
        </div>

        <h1 className={styles.title}>
          Set ambitious goals.<br />
          <span className={styles.titleAccent}>Track them ruthlessly.</span>
        </h1>

        <p className={styles.subtitle}>
          AtomQuest is the goal-setting and performance-tracking portal built for Atomberg —
          combining structured KRA frameworks, automatic score computation, and a delightful
          experience for employees, managers, and admins.
        </p>

        <div className={styles.actions}>
          <Link to="/login" className={styles.primaryBtn}>
            <IconBolt size={16} stroke={2.4} />
            Launch Portal
            <IconArrowRight size={16} />
          </Link>
          <a href="#features" className={styles.secondaryBtn}>Explore Features</a>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <span className={styles.metaNum}>4</span>
            <span className={styles.metaLabel}>UoM types</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaNum}>Q1–Q4</span>
            <span className={styles.metaLabel}>Check-in cycles</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaNum}>3</span>
            <span className={styles.metaLabel}>Role-based dashboards</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaNum}>100%</span>
            <span className={styles.metaLabel}>Auditable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
