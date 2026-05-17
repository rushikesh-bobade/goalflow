import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { UsersTable } from '~/blocks/user-hierarchy-management/users-table';
import styles from './user-hierarchy-management.module.css';

export function meta() {
  return [{ title: 'Users & Hierarchy — AtomQuest' }];
}

export default function UserHierarchyManagementPage() {
  return (
    <AuthenticatedPage allowedRoles={['admin']}>
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Users & Hierarchy</h1>
            <p className={styles.sub}>Manage all users, roles, and reporting structures.</p>
          </div>
          <UsersTable />
        </div>
      </div>
    </AuthenticatedPage>
  );
}
