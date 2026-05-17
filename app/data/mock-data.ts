export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  managerId?: string;
  avatarInitials: string;
}

export interface ThrustArea {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GoalCycle {
  id: string;
  name: string;
  phase: 'goal_setting' | 'q1' | 'q2' | 'q3' | 'q4';
  windowOpen: string;
  windowClose: string;
  isActive: boolean;
}

export type GoalStatus = 'draft' | 'submitted' | 'approved' | 'rework' | 'locked';
export type UomType = 'numeric_min' | 'numeric_max' | 'timeline' | 'zero';

export interface Goal {
  id: string;
  employeeId: string;
  cycleId: string;
  thrustAreaId: string;
  title: string;
  description: string;
  uomType: UomType;
  targetValue?: number;
  targetDate?: string;
  weightage: number;
  status: GoalStatus;
  isShared: boolean;
  sharedBy?: string;
  parentGoalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalApproval {
  id: string;
  goalId: string;
  managerId: string;
  action: 'approved' | 'rejected' | 'rework' | 'edited';
  comment?: string;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  goalId: string;
  cycleId: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  actualValue?: number;
  actualDate?: string;
  progressStatus: 'not_started' | 'on_track' | 'completed';
  computedScore?: number;
  managerComment?: string;
  employeeSubmittedAt?: string;
  managerReviewedAt?: string;
}

export interface EscalationRule {
  id: string;
  ruleType: 'submission_delay' | 'approval_delay' | 'checkin_delay';
  thresholdDays: number;
  notifyEmployee: boolean;
  notifyManager: boolean;
  notifyHR: boolean;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  goalId?: string;
  action: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  deepLink?: string;
  createdAt: string;
}

// Users
export const USERS: User[] = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@atomberg.com', role: 'admin', department: 'HR', avatarInitials: 'AU' },
  { id: 'mgr-1', name: 'Priya Sharma', email: 'manager@atomberg.com', role: 'manager', department: 'Sales', avatarInitials: 'PS' },
  { id: 'mgr-2', name: 'Rohit Mehta', email: 'manager2@atomberg.com', role: 'manager', department: 'Engineering', avatarInitials: 'RM' },
  { id: 'emp-1', name: 'Rushikesh Bobade', email: 'employee@atomberg.com', role: 'employee', department: 'Sales', managerId: 'mgr-1', avatarInitials: 'RB' },
  { id: 'emp-2', name: 'Anjali Verma', email: 'employee2@atomberg.com', role: 'employee', department: 'Sales', managerId: 'mgr-1', avatarInitials: 'AV' },
  { id: 'emp-3', name: 'Karan Joshi', email: 'employee3@atomberg.com', role: 'employee', department: 'Engineering', managerId: 'mgr-2', avatarInitials: 'KJ' },
];

// Thrust Areas
export const THRUST_AREAS: ThrustArea[] = [
  { id: 'ta-1', name: 'Revenue Growth', description: 'Goals targeting sales and revenue expansion', icon: '📈' },
  { id: 'ta-2', name: 'Customer Success', description: 'Customer retention, NPS and satisfaction', icon: '🤝' },
  { id: 'ta-3', name: 'Operational Excellence', description: 'Process efficiency, cost and TAT reduction', icon: '⚙️' },
  { id: 'ta-4', name: 'People & Culture', description: 'Team development, learning, engagement', icon: '🌱' },
  { id: 'ta-5', name: 'Innovation', description: 'New product features, R&D, patents', icon: '💡' },
  { id: 'ta-6', name: 'Safety & Compliance', description: 'Zero-incident and regulatory goals', icon: '🛡️' },
];

// Goal Cycles
export const GOAL_CYCLES: GoalCycle[] = [
  { id: 'gc-1', name: 'FY 2025-26', phase: 'goal_setting', windowOpen: '2025-05-01', windowClose: '2025-06-30', isActive: true },
  { id: 'gc-2', name: 'FY 2025-26', phase: 'q1', windowOpen: '2025-07-01', windowClose: '2025-07-31', isActive: false },
  { id: 'gc-3', name: 'FY 2025-26', phase: 'q2', windowOpen: '2025-10-01', windowClose: '2025-10-31', isActive: false },
  { id: 'gc-4', name: 'FY 2025-26', phase: 'q3', windowOpen: '2026-01-01', windowClose: '2026-01-31', isActive: false },
  { id: 'gc-5', name: 'FY 2025-26', phase: 'q4', windowOpen: '2026-03-01', windowClose: '2026-04-30', isActive: false },
];

// Goals
export const GOALS: Goal[] = [
  {
    id: 'goal-1', employeeId: 'emp-1', cycleId: 'gc-1', thrustAreaId: 'ta-1',
    title: 'Achieve ₹50L in new business revenue', description: 'Drive new customer acquisition in the North region',
    uomType: 'numeric_min', targetValue: 5000000, weightage: 30,
    status: 'approved', isShared: false, createdAt: '2025-05-10T10:00:00Z', updatedAt: '2025-05-15T14:00:00Z'
  },
  {
    id: 'goal-2', employeeId: 'emp-1', cycleId: 'gc-1', thrustAreaId: 'ta-2',
    title: 'Maintain NPS Score above 60', description: 'Improve customer satisfaction across assigned accounts',
    uomType: 'numeric_min', targetValue: 60, weightage: 20,
    status: 'approved', isShared: false, createdAt: '2025-05-10T10:00:00Z', updatedAt: '2025-05-15T14:00:00Z'
  },
  {
    id: 'goal-3', employeeId: 'emp-1', cycleId: 'gc-1', thrustAreaId: 'ta-3',
    title: 'Reduce order processing TAT by 20%', description: 'Streamline order fulfillment pipeline',
    uomType: 'numeric_max', targetValue: 2, weightage: 20,
    status: 'submitted', isShared: false, createdAt: '2025-05-11T09:00:00Z', updatedAt: '2025-05-11T09:00:00Z'
  },
  {
    id: 'goal-4', employeeId: 'emp-1', cycleId: 'gc-1', thrustAreaId: 'ta-4',
    title: 'Complete 3 LinkedIn Learning courses', description: 'Upskill in sales techniques and product knowledge',
    uomType: 'numeric_min', targetValue: 3, weightage: 10,
    status: 'draft', isShared: false, createdAt: '2025-05-12T11:00:00Z', updatedAt: '2025-05-12T11:00:00Z'
  },
  {
    id: 'goal-5', employeeId: 'emp-1', cycleId: 'gc-1', thrustAreaId: 'ta-6',
    title: 'Zero safety incidents in field visits', description: 'Maintain 100% safety compliance during all client visits',
    uomType: 'zero', targetValue: 0, weightage: 10,
    status: 'approved', isShared: true, sharedBy: 'admin-1', createdAt: '2025-05-08T08:00:00Z', updatedAt: '2025-05-15T14:00:00Z'
  },
  {
    id: 'goal-6', employeeId: 'emp-1', cycleId: 'gc-1', thrustAreaId: 'ta-5',
    title: 'Submit 2 product improvement proposals', description: 'Gather field insights and propose product enhancements',
    uomType: 'numeric_min', targetValue: 2, weightage: 10,
    status: 'rework', isShared: false, createdAt: '2025-05-13T12:00:00Z', updatedAt: '2025-05-16T10:00:00Z'
  },
];

// Check-ins
export const CHECK_INS: CheckIn[] = [
  {
    id: 'ci-1', goalId: 'goal-1', cycleId: 'gc-2', quarter: 'Q1',
    actualValue: 1800000, progressStatus: 'on_track', computedScore: 36,
    employeeSubmittedAt: '2025-07-28T10:00:00Z', managerReviewedAt: '2025-07-29T14:00:00Z',
    managerComment: 'Good progress, keep pushing for more enterprise deals.'
  },
  {
    id: 'ci-2', goalId: 'goal-2', cycleId: 'gc-2', quarter: 'Q1',
    actualValue: 65, progressStatus: 'on_track', computedScore: 100,
    employeeSubmittedAt: '2025-07-28T10:00:00Z', managerReviewedAt: '2025-07-29T14:00:00Z',
    managerComment: 'Excellent NPS score!'
  },
];

// Escalation Rules
export const ESCALATION_RULES: EscalationRule[] = [
  { id: 'er-1', ruleType: 'submission_delay', thresholdDays: 7, notifyEmployee: true, notifyManager: false, notifyHR: false, isActive: true },
  { id: 'er-2', ruleType: 'submission_delay', thresholdDays: 14, notifyEmployee: true, notifyManager: true, notifyHR: false, isActive: true },
  { id: 'er-3', ruleType: 'approval_delay', thresholdDays: 5, notifyEmployee: false, notifyManager: true, notifyHR: false, isActive: true },
  { id: 'er-4', ruleType: 'checkin_delay', thresholdDays: 10, notifyEmployee: true, notifyManager: true, notifyHR: true, isActive: false },
];

// Audit Logs
export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al-1', userId: 'emp-1', goalId: 'goal-1', action: 'goal_created', timestamp: '2025-05-10T10:00:00Z' },
  { id: 'al-2', userId: 'emp-1', goalId: 'goal-1', action: 'goal_submitted', timestamp: '2025-05-10T10:05:00Z' },
  { id: 'al-3', userId: 'mgr-1', goalId: 'goal-1', action: 'goal_approved', timestamp: '2025-05-15T14:00:00Z' },
  { id: 'al-4', userId: 'mgr-1', goalId: 'goal-3', action: 'goal_edited', fieldChanged: 'weightage', oldValue: '25', newValue: '20', timestamp: '2025-05-15T14:30:00Z' },
  { id: 'al-5', userId: 'mgr-1', goalId: 'goal-6', action: 'goal_rework', fieldChanged: 'comment', newValue: 'Please clarify the proposal format', timestamp: '2025-05-16T10:00:00Z' },
  { id: 'al-6', userId: 'admin-1', goalId: 'goal-4', action: 'goal_unlocked', fieldChanged: 'status', oldValue: 'locked', newValue: 'draft', timestamp: '2025-05-17T09:00:00Z' },
  { id: 'al-7', userId: 'emp-1', goalId: 'goal-1', action: 'checkin_submitted', fieldChanged: 'quarter', newValue: 'Q1', timestamp: '2025-07-28T10:00:00Z' },
  { id: 'al-8', userId: 'admin-1', action: 'shared_goal_pushed', newValue: 'Zero safety incidents', timestamp: '2025-05-08T08:00:00Z' },
];

// Notifications
export const NOTIFICATIONS: Notification[] = [
  { id: 'n-1', userId: 'emp-1', type: 'goal_approved', title: 'Goals Approved', message: 'Your goals have been approved and locked by Priya Sharma', isRead: false, deepLink: '/employee/dashboard', createdAt: '2025-05-15T14:00:00Z' },
  { id: 'n-2', userId: 'emp-1', type: 'goal_rework', title: 'Goal Returned for Rework', message: 'Manager returned your goal: Please clarify the proposal format', isRead: false, deepLink: '/employee/goals/goal-6', createdAt: '2025-05-16T10:00:00Z' },
  { id: 'n-3', userId: 'emp-1', type: 'goal_unlocked', title: 'Goal Unlocked', message: 'Admin unlocked your goal: Complete 3 LinkedIn Learning courses', isRead: true, deepLink: '/employee/goals/goal-4', createdAt: '2025-05-17T09:00:00Z' },
  { id: 'n-4', userId: 'mgr-1', type: 'goal_submitted', title: 'Goals Submitted', message: 'Rushikesh Bobade submitted goals for approval', isRead: false, deepLink: '/manager/approvals', createdAt: '2025-05-10T10:05:00Z' },
];
