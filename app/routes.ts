import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/employee/dashboard", "routes/employee-dashboard.tsx"),
  route("/employee/goals/new", "routes/create-goal.tsx"),
  route("/employee/goals/:goalId", "routes/goal-detail.tsx"),
  route("/employee/checkin", "routes/employee-check-in.tsx"),
  route("/manager/dashboard", "routes/manager-dashboard.tsx"),
  route("/manager/approvals", "routes/manager-approvals.tsx"),
  route("/manager/checkin", "routes/manager-check-in-review.tsx"),
  route("/manager/team/:employeeId", "routes/employee-goal-view-manager.tsx"),
  route("/admin/dashboard", "routes/admin-dashboard.tsx"),
  route("/admin/users", "routes/user-hierarchy-management.tsx"),
  route("/admin/escalations", "routes/escalation-rules.tsx"),
  route("/admin/audit", "routes/audit-trail.tsx"),
  route("/admin/reports", "routes/reports-analytics.tsx"),
] satisfies RouteConfig;
