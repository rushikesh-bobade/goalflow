import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  USERS, GOALS, GOAL_CYCLES, NOTIFICATIONS, AUDIT_LOGS, ESCALATION_RULES, CHECK_INS,
  type User, type Goal, type GoalCycle, type Notification, type AuditLog, type EscalationRule, type CheckIn
} from '~/data/mock-data';

interface AppState {
  currentUser: User | null;
  users: User[];
  goals: Goal[];
  goalCycles: GoalCycle[];
  checkIns: CheckIn[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  escalationRules: EscalationRule[];
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (userId: string) => User | null;
  logout: () => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  approveGoals: (goalIds: string[], managerId: string, comment?: string) => void;
  rejectGoals: (goalIds: string[], managerId: string, comment: string) => void;
  reworkGoals: (goalIds: string[], managerId: string, comment: string) => void;
  submitGoals: (goalIds: string[]) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  toggleCycleActive: (cycleId: string) => void;
  unlockGoal: (goalId: string, reason: string, adminId: string) => void;
  pushSharedGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, employeeIds: string[]) => void;
  addEscalationRule: (rule: EscalationRule) => void;
  toggleEscalationRule: (ruleId: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppState | null>(null);
const SESSION_KEY = 'atomquest-session';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [users] = useState(USERS);
  const [goals, setGoals] = useState<Goal[]>(GOALS);
  const [goalCycles, setGoalCycles] = useState<GoalCycle[]>(GOAL_CYCLES);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(CHECK_INS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(ESCALATION_RULES);

  // Hydrate session from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(SESSION_KEY) : null;
      if (saved) {
        const user = USERS.find(u => u.id === saved);
        if (user) setCurrentUser(user);
      }
    } catch {
      /* ignore storage errors */
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback((userId: string): User | null => {
    const user = USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      try { window.localStorage.setItem(SESSION_KEY, userId); } catch { /* ignore */ }
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try { window.localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id'>) => {
    setAuditLogs(prev => [{ ...log, id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...prev]);
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [{
      ...n,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setGoals(prev => [...prev, goal]);
    addAuditLog({
      userId: goal.employeeId, goalId: goal.id, action: 'goal_created',
      newValue: goal.title, timestamp: new Date().toISOString()
    });
  }, [addAuditLog]);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const submitGoals = useCallback((goalIds: string[]) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'submitted', updatedAt: new Date().toISOString() } : g));
    // Notify managers
    const employee = currentUser;
    if (employee?.managerId) {
      addNotification({
        userId: employee.managerId, type: 'goal_submitted',
        title: 'Goals Submitted for Approval',
        message: `${employee.name} submitted ${goalIds.length} goal(s) for approval`,
        isRead: false, deepLink: '/manager/approvals',
      });
    }
    goalIds.forEach(gid => addAuditLog({
      userId: employee?.id || '', goalId: gid, action: 'goal_submitted',
      timestamp: new Date().toISOString()
    }));
  }, [addAuditLog, addNotification, currentUser]);

  const approveGoals = useCallback((goalIds: string[], managerId: string, comment?: string) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'approved', updatedAt: new Date().toISOString() } : g));
    addAuditLog({ userId: managerId, action: 'goals_approved', newValue: goalIds.join(','), timestamp: new Date().toISOString() });
    // Notify employee
    const firstGoal = goals.find(g => g.id === goalIds[0]);
    if (firstGoal) {
      addNotification({
        userId: firstGoal.employeeId, type: 'goal_approved',
        title: 'Goals Approved & Locked',
        message: `Your ${goalIds.length} goal(s) have been approved${comment ? `: ${comment}` : ''}`,
        isRead: false, deepLink: '/employee/dashboard',
      });
    }
  }, [addAuditLog, addNotification, goals]);

  const rejectGoals = useCallback((goalIds: string[], managerId: string, comment: string) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'draft', updatedAt: new Date().toISOString() } : g));
    addAuditLog({ userId: managerId, action: 'goals_rejected', newValue: comment, timestamp: new Date().toISOString() });
    const firstGoal = goals.find(g => g.id === goalIds[0]);
    if (firstGoal) {
      addNotification({
        userId: firstGoal.employeeId, type: 'goal_rejected',
        title: 'Goals Rejected',
        message: `Manager rejected your goals: ${comment}`,
        isRead: false, deepLink: '/employee/dashboard',
      });
    }
  }, [addAuditLog, addNotification, goals]);

  const reworkGoals = useCallback((goalIds: string[], managerId: string, comment: string) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'rework', updatedAt: new Date().toISOString() } : g));
    addAuditLog({ userId: managerId, action: 'goals_rework', newValue: comment, timestamp: new Date().toISOString() });
    const firstGoal = goals.find(g => g.id === goalIds[0]);
    if (firstGoal) {
      addNotification({
        userId: firstGoal.employeeId, type: 'goal_rework',
        title: 'Goal Returned for Rework',
        message: `Manager returned your goals: ${comment}`,
        isRead: false, deepLink: '/employee/dashboard',
      });
    }
  }, [addAuditLog, addNotification, goals]);

  const addCheckIn = useCallback((checkIn: CheckIn) => {
    setCheckIns(prev => [...prev, checkIn]);
    const goal = goals.find(g => g.id === checkIn.goalId);
    addAuditLog({
      userId: goal?.employeeId || '', goalId: checkIn.goalId, action: 'checkin_submitted',
      fieldChanged: 'quarter', newValue: checkIn.quarter, timestamp: new Date().toISOString()
    });
    // Notify manager
    if (goal?.employeeId) {
      const employee = users.find(u => u.id === goal.employeeId);
      if (employee?.managerId) {
        addNotification({
          userId: employee.managerId, type: 'checkin_submitted',
          title: 'Check-in Submitted',
          message: `${employee.name} completed their ${checkIn.quarter} check-in`,
          isRead: false, deepLink: '/manager/checkin',
        });
      }
    }
  }, [addAuditLog, addNotification, goals, users]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n =>
      n.userId === currentUser?.id ? { ...n, isRead: true } : n
    ));
  }, [currentUser]);

  const toggleCycleActive = useCallback((cycleId: string) => {
    setGoalCycles(prev => prev.map(c => ({
      ...c,
      isActive: c.id === cycleId ? !c.isActive : c.isActive,
    })));
  }, []);

  const unlockGoal = useCallback((goalId: string, reason: string, adminId: string) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'draft', updatedAt: new Date().toISOString() } : g));
    addAuditLog({ userId: adminId, goalId, action: 'goal_unlocked', fieldChanged: 'status', oldValue: 'locked', newValue: 'draft', timestamp: new Date().toISOString() });
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      addNotification({
        userId: goal.employeeId, type: 'goal_unlocked',
        title: 'Goal Unlocked by Admin',
        message: `Admin unlocked your goal: ${goal.title}. Reason: ${reason}`,
        isRead: false, deepLink: `/employee/goals/${goalId}`,
      });
    }
  }, [addAuditLog, addNotification, goals]);

  const pushSharedGoal = useCallback((goalTemplate: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, employeeIds: string[]) => {
    const now = new Date().toISOString();
    const newGoals: Goal[] = employeeIds.map(empId => ({
      ...goalTemplate, id: `goal-shared-${Date.now()}-${empId}`,
      employeeId: empId, isShared: true, createdAt: now, updatedAt: now
    }));
    setGoals(prev => [...prev, ...newGoals]);
    addAuditLog({ userId: goalTemplate.sharedBy || '', action: 'shared_goal_pushed', newValue: goalTemplate.title, timestamp: now });
    employeeIds.forEach(empId => {
      addNotification({
        userId: empId, type: 'shared_goal_received',
        title: 'New Shared Goal Assigned',
        message: `Admin pushed a new shared goal: ${goalTemplate.title}`,
        isRead: false, deepLink: '/employee/dashboard',
      });
    });
  }, [addAuditLog, addNotification]);

  const addEscalationRule = useCallback((rule: EscalationRule) => {
    setEscalationRules(prev => [...prev, rule]);
  }, []);

  const toggleEscalationRule = useCallback((ruleId: string) => {
    setEscalationRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users, goals, goalCycles, checkIns, notifications, auditLogs, escalationRules,
      isAuthenticated: !!currentUser, isHydrated,
      login, logout, addGoal, updateGoal, deleteGoal, approveGoals, rejectGoals, reworkGoals, submitGoals,
      addCheckIn, markNotificationRead, markAllNotificationsRead, toggleCycleActive, unlockGoal, pushSharedGoal,
      addEscalationRule, toggleEscalationRule, addAuditLog, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
