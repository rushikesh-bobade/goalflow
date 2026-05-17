import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { IconPencil, IconCheck } from '@tabler/icons-react';
import styles from './users-table.module.css';

export function UsersTable() {
  const { users } = useAppState();
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>User Management</h2>
        <input
          className={styles.search}
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => {
              const manager = users.find(u => u.id === user.managerId);
              return (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{user.avatarInitials}</div>
                      <span className={styles.userName}>{user.name}</span>
                    </div>
                  </td>
                  <td className={styles.email}>{user.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[`role_${user.role}`]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.department}</td>
                  <td>{manager?.name ?? '—'}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => setEditingUserId(user.id)}>
                      <IconPencil size={14} /> Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
