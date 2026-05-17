import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import styles from './app-shell.module.css';

interface Props {
  children: React.ReactNode;
}

/**
 * Main authenticated app layout — sidebar + topbar + content.
 */
export function AppShell({ children }: Props) {
  return (
    <div className={styles.shell}>
      <AppSidebar />
      <div className={styles.main}>
        <AppTopbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
