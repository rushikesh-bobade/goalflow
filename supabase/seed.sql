-- Supabase seed data for AtomQuest

-- 1. Create Users
-- Since we are mocking auth for now in the local dev, we will just insert raw users.
-- We must use valid UUIDs instead of 'emp-1' etc.
-- Let's define some stable UUIDs for our seed data.
-- admin: 00000000-0000-0000-0000-000000000001
-- mgr-1: 00000000-0000-0000-0000-000000000002
-- mgr-2: 00000000-0000-0000-0000-000000000003
-- emp-1: 00000000-0000-0000-0000-000000000004
-- emp-2: 00000000-0000-0000-0000-000000000005
-- emp-3: 00000000-0000-0000-0000-000000000006

-- Insert into auth.users (to satisfy foreign keys if we eventually link it, but wait, the migration references auth.users).
-- Let's insert into auth.users first.
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@atomberg.com', '...', now(), now(), now(), '{}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'manager@atomberg.com', '...', now(), now(), now(), '{}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'manager2@atomberg.com', '...', now(), now(), now(), '{}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'employee@atomberg.com', '...', now(), now(), now(), '{}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'employee2@atomberg.com', '...', now(), now(), now(), '{}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'employee3@atomberg.com', '...', now(), now(), now(), '{}', '{}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, name, email, role, department, manager_id, avatar_initials) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@atomberg.com', 'admin', 'HR', NULL, 'AU'),
  ('00000000-0000-0000-0000-000000000002', 'Priya Sharma', 'manager@atomberg.com', 'manager', 'Sales', NULL, 'PS'),
  ('00000000-0000-0000-0000-000000000003', 'Rohit Mehta', 'manager2@atomberg.com', 'manager', 'Engineering', NULL, 'RM');

INSERT INTO public.users (id, name, email, role, department, manager_id, avatar_initials) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Rushikesh Bobade', 'employee@atomberg.com', 'employee', 'Sales', '00000000-0000-0000-0000-000000000002', 'RB'),
  ('00000000-0000-0000-0000-000000000005', 'Anjali Verma', 'employee2@atomberg.com', 'employee', 'Sales', '00000000-0000-0000-0000-000000000002', 'AV'),
  ('00000000-0000-0000-0000-000000000006', 'Karan Joshi', 'employee3@atomberg.com', 'employee', 'Engineering', '00000000-0000-0000-0000-000000000003', 'KJ');

-- 2. Thrust Areas (Using stable UUIDs starting with 1000)
INSERT INTO public.thrust_areas (id, name, description, icon) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Revenue Growth', 'Goals targeting sales and revenue expansion', '📈'),
  ('10000000-0000-0000-0000-000000000002', 'Customer Success', 'Customer retention, NPS and satisfaction', '🤝'),
  ('10000000-0000-0000-0000-000000000003', 'Operational Excellence', 'Process efficiency, cost and TAT reduction', '⚙️'),
  ('10000000-0000-0000-0000-000000000004', 'People & Culture', 'Team development, learning, engagement', '🌱'),
  ('10000000-0000-0000-0000-000000000005', 'Innovation', 'New product features, R&D, patents', '💡'),
  ('10000000-0000-0000-0000-000000000006', 'Safety & Compliance', 'Zero-incident and regulatory goals', '🛡️');

-- 3. Goal Cycles (Using stable UUIDs starting with 2000)
INSERT INTO public.goal_cycles (id, name, phase, window_open, window_close, is_active) VALUES
  ('20000000-0000-0000-0000-000000000001', 'FY 2025-26', 'goal_setting', '2025-05-01', '2025-06-30', true),
  ('20000000-0000-0000-0000-000000000002', 'FY 2025-26', 'q1', '2025-07-01', '2025-07-31', false),
  ('20000000-0000-0000-0000-000000000003', 'FY 2025-26', 'q2', '2025-10-01', '2025-10-31', false),
  ('20000000-0000-0000-0000-000000000004', 'FY 2025-26', 'q3', '2026-01-01', '2026-01-31', false),
  ('20000000-0000-0000-0000-000000000005', 'FY 2025-26', 'q4', '2026-03-01', '2026-04-30', false);

-- 4. Goals (Using stable UUIDs starting with 3000)
INSERT INTO public.goals (id, employee_id, cycle_id, thrust_area_id, title, description, uom_type, target_value, target_date, weightage, status, is_shared, shared_by, created_at, updated_at) VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Achieve ₹50L in new business revenue', 'Drive new customer acquisition in the North region', 'numeric_min', 5000000, NULL, 30, 'approved', false, NULL, '2025-05-10 10:00:00', '2025-05-15 14:00:00'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Maintain NPS Score above 60', 'Improve customer satisfaction across assigned accounts', 'numeric_min', 60, NULL, 20, 'approved', false, NULL, '2025-05-10 10:00:00', '2025-05-15 14:00:00'),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Reduce order processing TAT by 20%', 'Streamline order fulfillment pipeline', 'numeric_max', 2, NULL, 20, 'submitted', false, NULL, '2025-05-11 09:00:00', '2025-05-11 09:00:00'),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Complete 3 LinkedIn Learning courses', 'Upskill in sales techniques and product knowledge', 'numeric_min', 3, NULL, 10, 'draft', false, NULL, '2025-05-12 11:00:00', '2025-05-12 11:00:00'),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Zero safety incidents in field visits', 'Maintain 100% safety compliance during all client visits', 'zero', 0, NULL, 10, 'approved', true, '00000000-0000-0000-0000-000000000001', '2025-05-08 08:00:00', '2025-05-15 14:00:00'),
  ('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Submit 2 product improvement proposals', 'Gather field insights and propose product enhancements', 'numeric_min', 2, NULL, 10, 'rework', false, NULL, '2025-05-13 12:00:00', '2025-05-16 10:00:00');

-- 5. Check-ins (Using stable UUIDs starting with 4000)
INSERT INTO public.check_ins (id, goal_id, cycle_id, quarter, actual_value, progress_status, computed_score, employee_submitted_at, manager_reviewed_at, manager_comment) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Q1', 1800000, 'on_track', 36, '2025-07-28 10:00:00', '2025-07-29 14:00:00', 'Good progress, keep pushing for more enterprise deals.'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Q1', 65, 'on_track', 100, '2025-07-28 10:00:00', '2025-07-29 14:00:00', 'Excellent NPS score!');

-- 6. Escalation Rules
INSERT INTO public.escalation_rules (id, rule_type, threshold_days, notify_employee, notify_manager, notify_hr, is_active) VALUES
  (gen_random_uuid(), 'submission_delay', 7, true, false, false, true),
  (gen_random_uuid(), 'submission_delay', 14, true, true, false, true),
  (gen_random_uuid(), 'approval_delay', 5, false, true, false, true),
  (gen_random_uuid(), 'checkin_delay', 10, true, true, true, false);

-- 7. Audit Logs
INSERT INTO public.audit_logs (user_id, goal_id, action, timestamp) VALUES
  ('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'goal_created', '2025-05-10 10:00:00'),
  ('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'goal_submitted', '2025-05-10 10:05:00'),
  ('00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'goal_approved', '2025-05-15 14:00:00');

-- 8. Notifications
INSERT INTO public.notifications (user_id, type, title, message, is_read, deep_link, created_at) VALUES
  ('00000000-0000-0000-0000-000000000004', 'goal_approved', 'Goals Approved', 'Your goals have been approved and locked by Priya Sharma', false, '/employee/dashboard', '2025-05-15 14:00:00'),
  ('00000000-0000-0000-0000-000000000004', 'goal_rework', 'Goal Returned for Rework', 'Manager returned your goal: Please clarify the proposal format', false, '/employee/goals/30000000-0000-0000-0000-000000000006', '2025-05-16 10:00:00'),
  ('00000000-0000-0000-0000-000000000004', 'goal_unlocked', 'Goal Unlocked', 'Admin unlocked your goal: Complete 3 LinkedIn Learning courses', true, '/employee/goals/30000000-0000-0000-0000-000000000004', '2025-05-17 09:00:00'),
  ('00000000-0000-0000-0000-000000000002', 'goal_submitted', 'Goals Submitted', 'Rushikesh Bobade submitted goals for approval', false, '/manager/approvals', '2025-05-10 10:05:00');

