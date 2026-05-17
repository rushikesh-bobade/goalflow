import { LandingNavbar } from '~/blocks/landing/landing-navbar';
import { LandingHero } from '~/blocks/landing/landing-hero';
import { FeatureGrid } from '~/blocks/landing/feature-grid';
import { HowItWorks } from '~/blocks/landing/how-it-works';
import { RolesShowcase } from '~/blocks/landing/roles-showcase';
import { LandingFooter } from '~/blocks/landing/landing-footer';
import styles from './home.module.css';

export function meta() {
  return [
    { title: 'AtomQuest — Goal Setting & Tracking Portal' },
    { name: 'description', content: 'Goal setting and tracking portal for Atomberg.' },
  ];
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <LandingNavbar />
      <main>
        <LandingHero />
        <FeatureGrid />
        <HowItWorks />
        <RolesShowcase />
      </main>
      <LandingFooter />
    </div>
  );
}
