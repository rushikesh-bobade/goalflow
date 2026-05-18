import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '~/lib/supabase';
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
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppState | null>(null);
const SESSION_KEY = 'atomquest-session';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [users, setUsers] = useState<User[]>(USERS);
  const [goals, setGoals] = useState<Goal[]>(GOALS);
  const [goalCycles, setGoalCycles] = useState<GoalCycle[]>(GOAL_CYCLES);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(CHECK_INS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(ESCALATION_RULES);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (window.localStorage.getItem('atomquest-theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  // Apply theme to html element on theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('atomquest-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Supabase Sync: Fetch all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, goalsRes, cyclesRes, checkinsRes, notifsRes, logsRes, rulesRes] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('goals').select('*'),
          supabase.from('goal_cycles').select('*'),
          supabase.from('check_ins').select('*'),
          supabase.from('notifications').select('*'),
          supabase.from('audit_logs').select('*'),
          supabase.from('escalation_rules').select('*')
        ]);

        if (usersRes.data?.length) setUsers(usersRes.data.map((u: any) => ({ ...u, managerId: u.manager_id, avatarInitials: u.avatar_initials })) as User[]);
        if (goalsRes.data?.length) setGoals(goalsRes.data.map((g: any) => ({
          ...g, employeeId: g.employee_id, cycleId: g.cycle_id, thrustAreaId: g.thrust_area_id,
          uomType: g.uom_type, targetValue: g.target_value, targetDate: g.target_date,
          isShared: g.is_shared, sharedBy: g.shared_by, parentGoalId: g.parent_goal_id,
          createdAt: g.created_at, updatedAt: g.updated_at
        })) as Goal[]);
        if (cyclesRes.data?.length) setGoalCycles(cyclesRes.data.map((c: any) => ({
          ...c, windowOpen: c.window_open, windowClose: c.window_close, isActive: c.is_active
        })) as GoalCycle[]);
        if (checkinsRes.data?.length) setCheckIns(checkinsRes.data.map((c: any) => ({
          ...c, goalId: c.goal_id, cycleId: c.cycle_id, actualValue: c.actual_value,
          actualDate: c.actual_date, progressStatus: c.progress_status, computedScore: c.computed_score,
          managerComment: c.manager_comment, employeeSubmittedAt: c.employee_submitted_at,
          managerReviewedAt: c.manager_reviewed_at
        })) as CheckIn[]);
        if (notifsRes.data?.length) setNotifications(notifsRes.data.map((n: any) => ({
          ...n, userId: n.user_id, isRead: n.is_read, deepLink: n.deep_link, createdAt: n.created_at
        })) as Notification[]);
        if (logsRes.data?.length) setAuditLogs(logsRes.data.map((l: any) => ({
          ...l, userId: l.user_id, goalId: l.goal_id, fieldChanged: l.field_changed,
          oldValue: l.old_value, newValue: l.new_value
        })) as AuditLog[]);
        if (rulesRes.data?.length) setEscalationRules(rulesRes.data.map((r: any) => ({
          ...r, ruleType: r.rule_type, thresholdDays: r.threshold_days, notifyEmployee: r.notify_employee,
          notifyManager: r.notify_manager, notifyHr: r.notify_hr, isActive: r.is_active
        })) as EscalationRule[]);
      } catch (e) {
        console.error("Failed to sync from Supabase, falling back to mock data", e);
      }
    }
    loadData();
  }, []);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(SESSION_KEY) : null;
      if (saved && users.length > 0) {
        const user = users.find(u => u.id === saved);
        if (user) setCurrentUser(user);
      }
    } catch {
      /* ignore storage errors */
    }
    setIsHydrated(true);
  }, [users]);

  const login = useCallback((userId: string): User | null => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      try { window.localStorage.setItem(SESSION_KEY, userId); } catch { /* ignore */ }
      return user;
    }
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try { window.localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id'>) => {
    const newLog = { ...log, id: `al-${Date.now()}` } as AuditLog;
    setAuditLogs(prev => [newLog, ...prev]);
    // Supabase Sync (Fire and forget)
    supabase.from('audit_logs').insert([{
      user_id: log.userId, goal_id: log.goalId, action: log.action,
      field_changed: log.fieldChanged, old_value: log.oldValue, new_value: log.newValue
    }]).then();
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif = { ...n, id: `n-${Date.now()}`, createdAt: new Date().toISOString() } as Notification;
    setNotifications(prev => [newNotif, ...prev]);
    // Supabase Sync
    supabase.from('notifications').insert([{
      user_id: n.userId, type: n.type, title: n.title, message: n.message, deep_link: n.deepLink
    }]).then();
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setGoals(prev => [...prev, goal]);
    
    // Convert to DB snake_case structure before insert
    const dbGoal = {
      id: goal.id, employee_id: goal.employeeId, cycle_id: goal.cycleId, 
      thrust_area_id: goal.thrustAreaId, title: goal.title, description: goal.description,
      uom_type: goal.uomType, target_value: goal.targetValue, target_date: goal.targetDate,
      weightage: goal.weightage, status: goal.status, is_shared: goal.isShared,
      parent_goal_id: goal.parentGoalId, shared_by: goal.sharedBy
    };
    supabase.from('goals').insert([dbGoal]).then();
    
    addAuditLog({
      userId: goal.employeeId, goalId: goal.id, action: 'goal_created',
      newValue: goal.title, timestamp: new Date().toISOString()
    });
  }, [addAuditLog]);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g));
    
    // DB Mapping
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.targetValue) dbUpdates.target_value = updates.targetValue;
    if (updates.weightage) dbUpdates.weightage = updates.weightage;
    if (updates.status) dbUpdates.status = updates.status;
    
    supabase.from('goals').update(dbUpdates).eq('id', goalId).then();
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    supabase.from('goals').delete().eq('id', goalId).then();
  }, []);

  const approveGoals = useCallback((goalIds: string[], managerId: string, comment?: string) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'approved', updatedAt: new Date().toISOString() } : g));
    supabase.from('goals').update({ status: 'approved' }).in('id', goalIds).then();
    
    goalIds.forEach(id => {
      const g = goals.find(x => x.id === id);
      if (g) {
        addNotification({ userId: g.employeeId, type: 'goal_approved', title: 'Goals Approved', message: 'Your goals were approved.', deepLink: '/employee/dashboard', isRead: false });
        addAuditLog({ userId: managerId, goalId: id, action: 'goal_approved', timestamp: new Date().toISOString() });
      }
    });
  }, [goals, addNotification, addAuditLog]);

  const rejectGoals = useCallback((goalIds: string[], managerId: string, comment: string) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'draft', updatedAt: new Date().toISOString() } : g));
    supabase.from('goals').update({ status: 'draft' }).in('id', goalIds).then();
    goalIds.forEach(id => {
      const g = goals.find(x => x.id === id);
      if (g) addNotification({ userId: g.employeeId, type: 'goal_rejected', title: 'Goals Rejected', message: comment, deepLink: '/employee/dashboard', isRead: false });
    });
  }, [goals, addNotification]);

  const reworkGoals = useCallback((goalIds: string[], managerId: string, comment: string) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'rework', updatedAt: new Date().toISOString() } : g));
    supabase.from('goals').update({ status: 'rework' }).in('id', goalIds).then();
    goalIds.forEach(id => {
      const g = goals.find(x => x.id === id);
      if (g) addNotification({ userId: g.employeeId, type: 'goal_rework', title: 'Goal Needs Rework', message: comment, deepLink: `/employee/goals/${id}`, isRead: false });
    });
  }, [goals, addNotification]);

  const submitGoals = useCallback((goalIds: string[]) => {
    setGoals(prev => prev.map(g => goalIds.includes(g.id) ? { ...g, status: 'submitted', updatedAt: new Date().toISOString() } : g));
    supabase.from('goals').update({ status: 'submitted' }).in('id', goalIds).then();
    
    // Notify manager
    const sampleGoal = goals.find(g => goalIds.includes(g.id));
    if (sampleGoal && currentUser?.managerId) {
       addNotification({ userId: currentUser.managerId, type: 'goal_submitted', title: 'Goals Submitted', message: `${currentUser.name} submitted goals.`, deepLink: '/manager/approvals', isRead: false });
    }
  }, [goals, currentUser, addNotification]);

  const addCheckIn = useCallback((checkIn: CheckIn) => {
    setCheckIns(prev => [...prev, checkIn]);
    
    const dbCheckin = {
      id: checkIn.id, goal_id: checkIn.goalId, cycle_id: checkIn.cycleId, quarter: checkIn.quarter,
      actual_value: checkIn.actualValue, actual_date: checkIn.actualDate, progress_status: checkIn.progressStatus,
      computed_score: checkIn.computedScore, employee_submitted_at: checkIn.employeeSubmittedAt,
      manager_reviewed_at: checkIn.managerReviewedAt, manager_comment: checkIn.managerComment
    };
    supabase.from('check_ins').insert([dbCheckin]).then();
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).then();
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
    supabase.from('notifications').update({ is_read: true }).eq('user_id', currentUser.id).then();
  }, [currentUser]);

  const toggleCycleActive = useCallback((cycleId: string) => {
    const cycle = goalCycles.find(c => c.id === cycleId);
    if (!cycle) return;
    setGoalCycles(prev => prev.map(c => c.id === cycleId ? { ...c, isActive: !c.isActive } : c));
    supabase.from('goal_cycles').update({ is_active: !cycle.isActive }).eq('id', cycleId).then();
  }, [goalCycles]);

  const unlockGoal = useCallback((goalId: string, reason: string, adminId: string) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'draft', updatedAt: new Date().toISOString() } : g));
    supabase.from('goals').update({ status: 'draft' }).eq('id', goalId).then();
    
    const g = goals.find(x => x.id === goalId);
    if (g) {
      addNotification({ userId: g.employeeId, type: 'goal_unlocked', title: 'Goal Unlocked', message: `Admin unlocked: ${reason}`, deepLink: `/employee/goals/${goalId}`, isRead: false });
      addAuditLog({ userId: adminId, goalId: goalId, action: 'goal_unlocked', newValue: 'draft', timestamp: new Date().toISOString() });
    }
  }, [goals, addNotification, addAuditLog]);

  const pushSharedGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, employeeIds: string[]) => {
    const newGoals = employeeIds.map(empId => ({
      ...goal, id: `g-${Date.now()}-${empId}`, employeeId: empId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    })) as Goal[];
    
    setGoals(prev => [...prev, ...newGoals]);
    
    const dbGoals = newGoals.map(g => ({
       id: g.id, employee_id: g.employeeId, cycle_id: g.cycleId, thrust_area_id: g.thrustAreaId,
       title: g.title, description: g.description, uom_type: g.uomType, target_value: g.targetValue,
       weightage: g.weightage, status: g.status, is_shared: g.isShared, shared_by: g.sharedBy
    }));
    supabase.from('goals').insert(dbGoals).then();

    newGoals.forEach(g => {
      addNotification({ userId: g.employeeId, type: 'goal_shared', title: 'New Shared Goal', message: `A KPI was pushed to your goal sheet.`, deepLink: `/employee/dashboard`, isRead: false });
    });
  }, [addNotification]);

  const addEscalationRule = useCallback((rule: EscalationRule) => {
    setEscalationRules(prev => [...prev, rule]);
  }, []);

  const toggleEscalationRule = useCallback((ruleId: string) => {
    setEscalationRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  }, []);

  const value = {
    currentUser, users, goals, goalCycles, checkIns, notifications, auditLogs, escalationRules,
    isAuthenticated: !!currentUser, isHydrated,
    login, logout, addGoal, updateGoal, deleteGoal, approveGoals, rejectGoals, reworkGoals,
    submitGoals, addCheckIn, markNotificationRead, markAllNotificationsRead, toggleCycleActive,
    unlockGoal, pushSharedGoal, addEscalationRule, toggleEscalationRule, addAuditLog, addNotification,
    theme, toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within an AppProvider');
  return context;
}
