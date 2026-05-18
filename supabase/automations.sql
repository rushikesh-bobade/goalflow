-- 1. Setup Database Webhook for Notifications (Bonus 5.2)
-- Make sure to replace <YOUR_PROJECT_REF> with your actual project reference if deploying via SQL,
-- OR simply create the webhook via the Supabase Dashboard -> Database -> Webhooks.

create trigger "goal_status_notification"
  after update on "public"."goals"
  for each row
  execute function "supabase_functions"."http_request"(
    'http://localhost:54321/functions/v1/send-notification', -- Replace with production URL if needed
    'POST',
    '{"Content-type":"application/json"}',
    '{}',
    '1000'
  );

-- 2. Setup pg_cron for Escalations (Bonus 5.3)
-- This runs a nightly job at midnight to check for overdue goals and check-ins.
-- Note: You must enable the pg_cron extension first!
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'nightly_escalations',
  '0 0 * * *', -- Run at midnight every day
  $$
    WITH overdue_drafts AS (
      SELECT g.id, g.employee_id
      FROM goals g
      JOIN goal_cycles c ON g.cycle_id = c.id
      WHERE g.status = 'draft' 
        AND c.window_close < CURRENT_DATE
    )
    -- Insert a notification for the employee
    INSERT INTO notifications (user_id, type, title, message, deep_link)
    SELECT employee_id, 'escalation', 'Overdue Goal Submission', 'You missed the deadline for submitting your goals. Please submit them immediately.', '/employee/dashboard'
    FROM overdue_drafts;
  $$
);
