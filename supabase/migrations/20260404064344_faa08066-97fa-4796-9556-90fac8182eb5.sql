
-- 1. Add SELECT policy for kelas XII
CREATE POLICY "Authenticated can read kelas XII"
  ON public."kelas XII"
  FOR SELECT TO authenticated
  USING (true);

-- 2. Fix auth_users_audit admin SELECT policy
DROP POLICY IF EXISTS "admin_select" ON public.auth_users_audit;
CREATE POLICY "admin_select" ON public.auth_users_audit
  FOR SELECT TO authenticated
  USING (has_role('admin'::app_role));

-- 3. Fix notifications INSERT policy
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR has_role('admin'::app_role));

-- 4. Fix mutable search_path
CREATE OR REPLACE FUNCTION public.coerce_empty_uuid_to_null_profiles()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = 'public', 'pg_catalog'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.teacher_id IS NOT NULL AND trim(NEW.teacher_id::text) = '' THEN
      NEW.teacher_id := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- 5. Secure class_wellness_summary view
DROP VIEW IF EXISTS public.class_wellness_summary;
CREATE VIEW public.class_wellness_summary
WITH (security_invoker = true)
AS
SELECT
  date_trunc('day'::text, ml.created_at)::timestamp without time zone AS day,
  count(*) AS entries,
  avg(mood_score(ml.mood)) AS avg_mood_score,
  min(mood_score(ml.mood)) AS min_mood_score,
  max(mood_score(ml.mood)) AS max_mood_score
FROM public.mood_logs ml
GROUP BY (date_trunc('day'::text, ml.created_at));
