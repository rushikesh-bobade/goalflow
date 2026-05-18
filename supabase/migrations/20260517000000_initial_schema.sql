-- Create custom types
CREATE TYPE user_role AS ENUM ('employee', 'manager', 'admin');
CREATE TYPE cycle_phase AS ENUM ('goal_setting', 'q1', 'q2', 'q3', 'q4');
CREATE TYPE goal_status AS ENUM ('draft', 'submitted', 'approved', 'rework', 'locked');
CREATE TYPE uom_type AS ENUM ('numeric_min', 'numeric_max', 'timeline', 'zero');
CREATE TYPE progress_status AS ENUM ('not_started', 'on_track', 'completed');
CREATE TYPE checkin_quarter AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');
CREATE TYPE escalation_rule_type AS ENUM ('submission_delay', 'approval_delay', 'checkin_delay');

-- 1. Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  department TEXT,
  manager_id UUID REFERENCES public.users(id),
  avatar_initials TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Thrust Areas Table
CREATE TABLE public.thrust_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Goal Cycles Table
CREATE TABLE public.goal_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phase cycle_phase NOT NULL DEFAULT 'goal_setting',
  window_open DATE NOT NULL,
  window_close DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Goals Table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES public.goal_cycles(id),
  thrust_area_id UUID NOT NULL REFERENCES public.thrust_areas(id),
  title TEXT NOT NULL,
  description TEXT,
  uom_type uom_type NOT NULL,
  target_value NUMERIC,
  target_date DATE,
  weightage INTEGER NOT NULL CHECK (weightage >= 10 AND weightage <= 100),
  status goal_status NOT NULL DEFAULT 'draft',
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  shared_by UUID REFERENCES public.users(id),
  parent_goal_id UUID REFERENCES public.goals(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update goals.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. Goal Approvals (History of manager actions)
CREATE TABLE public.goal_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  manager_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Check-ins
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES public.goal_cycles(id),
  quarter checkin_quarter NOT NULL,
  actual_value NUMERIC,
  actual_date DATE,
  progress_status progress_status NOT NULL DEFAULT 'not_started',
  computed_score NUMERIC,
  manager_comment TEXT,
  employee_submitted_at TIMESTAMPTZ,
  manager_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Escalation Rules
CREATE TABLE public.escalation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type escalation_rule_type NOT NULL,
  threshold_days INTEGER NOT NULL,
  notify_employee BOOLEAN NOT NULL DEFAULT TRUE,
  notify_manager BOOLEAN NOT NULL DEFAULT TRUE,
  notify_hr BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  deep_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thrust_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (For Hackathon: mostly open for authenticated users, but locked down in production)
-- For now, we will allow all authenticated users to read everything, and insert/update based on role.
-- To keep it simple for the migration, we'll create permissive policies.
CREATE POLICY "Allow all authenticated users to read users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read thrust_areas" ON public.thrust_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read goal_cycles" ON public.goal_cycles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read goals" ON public.goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read goal_approvals" ON public.goal_approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read check_ins" ON public.check_ins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read escalation_rules" ON public.escalation_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read audit_logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to read notifications" ON public.notifications FOR SELECT TO authenticated USING (true);

-- Allow updates/inserts
CREATE POLICY "Allow updates for goals" ON public.goals FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow inserts for check_ins" ON public.check_ins FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow inserts for notifications" ON public.notifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow inserts for audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow updates for notifications" ON public.notifications FOR ALL TO authenticated USING (true);

-- We can lock these down further later, but for the MVP, this gets the data flowing.
