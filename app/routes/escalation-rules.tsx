import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { EscalationRulesTable } from '~/blocks/escalation-rules/escalation-rules-table';
import styles from './escalation-rules.module.css';

export function meta() {
  return [{ title: 'Escalation Rules — AtomQuest' }];
}

export default function EscalationRulesPage() {
  return (
    <AuthenticatedPage allowedRoles={['admin']}>
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Escalation Rules</h1>
            <p className={styles.sub}>Configure automated notifications for overdue actions.</p>
          </div>
          <EscalationRulesTable />
        </div>
      </div>
    </AuthenticatedPage>
  );
}
