import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { IconPlus } from '@tabler/icons-react';
import type { EscalationRule } from '~/data/mock-data';
import styles from './escalation-rules-table.module.css';

function CheckBox({ checked }: { checked: boolean }) {
  return <span className={checked ? styles.checkYes : styles.checkNo}>{checked ? '✔' : '−'}</span>;
}

export function EscalationRulesTable() {
  const { escalationRules, addEscalationRule, toggleEscalationRule } = useAppState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState<Partial<EscalationRule>>({
    ruleType: 'submission_delay', thresholdDays: 7, notifyEmployee: true, notifyManager: false, notifyHR: false, isActive: true
  });

  function handleAdd() {
    const rule: EscalationRule = {
      id: `er-${Date.now()}`,
      ruleType: newRule.ruleType as any,
      thresholdDays: newRule.thresholdDays || 7,
      notifyEmployee: newRule.notifyEmployee || false,
      notifyManager: newRule.notifyManager || false,
      notifyHR: newRule.notifyHR || false,
      isActive: true,
    };
    addEscalationRule(rule);
    setShowAddForm(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Escalation Rules</h2>
        <button className={styles.addBtn} onClick={() => setShowAddForm(p => !p)}>
          <IconPlus size={16} /> Add Rule
        </button>
      </div>

      {showAddForm && (
        <div className={styles.addForm}>
          <div className={styles.formRow}>
            <select className={styles.select} value={newRule.ruleType} onChange={e => setNewRule(p => ({ ...p, ruleType: e.target.value as any }))}>
              <option value="submission_delay">Submission Delay</option>
              <option value="approval_delay">Approval Delay</option>
              <option value="checkin_delay">Check-in Delay</option>
            </select>
            <input type="number" className={styles.input} placeholder="Threshold (days)" value={newRule.thresholdDays || ''}
              onChange={e => setNewRule(p => ({ ...p, thresholdDays: parseInt(e.target.value) }))} />
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={newRule.notifyEmployee} onChange={e => setNewRule(p => ({ ...p, notifyEmployee: e.target.checked }))} />
              Notify Employee
            </label>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={newRule.notifyManager} onChange={e => setNewRule(p => ({ ...p, notifyManager: e.target.checked }))} />
              Notify Manager
            </label>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={newRule.notifyHR} onChange={e => setNewRule(p => ({ ...p, notifyHR: e.target.checked }))} />
              Notify HR
            </label>
            <button className={styles.saveBtn} onClick={handleAdd}>Save Rule</button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rule Type</th>
              <th>Threshold (days)</th>
              <th>Notify Employee</th>
              <th>Notify Manager</th>
              <th>Notify HR</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {escalationRules.map(rule => (
              <tr key={rule.id}>
                <td><span className={styles.ruleType}>{rule.ruleType.replace('_', ' ')}</span></td>
                <td><span className={styles.threshold}>{rule.thresholdDays} days</span></td>
                <td><CheckBox checked={rule.notifyEmployee} /></td>
                <td><CheckBox checked={rule.notifyManager} /></td>
                <td><CheckBox checked={rule.notifyHR} /></td>
                <td>
                  <button
                    className={`${styles.toggleBtn} ${rule.isActive ? styles.active : styles.inactive}`}
                    onClick={() => toggleEscalationRule(rule.id)}
                  >
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
