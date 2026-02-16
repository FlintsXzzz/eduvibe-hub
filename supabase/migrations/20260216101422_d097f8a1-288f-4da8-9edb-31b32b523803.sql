
-- 1. Fix kelas XII: restrict write operations to admins only
DROP POLICY "Allow authenticated INSERT on kelas XII (required fields)" ON public."kelas XII";
DROP POLICY "Allow authenticated DELETE on kelas XII" ON public."kelas XII";
DROP POLICY "Allow authenticated UPDATE on kelas XII (require non-null field" ON public."kelas XII";

CREATE POLICY "Admins can insert kelas XII" ON public."kelas XII"
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete kelas XII" ON public."kelas XII"
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update kelas XII" ON public."kelas XII"
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Add mood value constraint
ALTER TABLE public.mood_logs
ADD CONSTRAINT valid_mood_values
CHECK (mood IN ('Great', 'Good', 'Okay', 'Low', 'Angry'));

-- 3. Fix has_role: restrict to current user only (new single-param version)
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  )
$$;

-- Update all policies to use new single-param has_role

-- user_roles SELECT
DROP POLICY "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR has_role('admin'::app_role));

-- quest_submissions SELECT
DROP POLICY "Read own or teacher view submissions" ON public.quest_submissions;
CREATE POLICY "Read own or teacher view submissions" ON public.quest_submissions
  FOR SELECT TO authenticated
  USING ((student_id = auth.uid()) OR has_role('teacher'::app_role) OR has_role('admin'::app_role));

-- quest_submissions UPDATE
DROP POLICY "Teachers can approve submissions" ON public.quest_submissions;
CREATE POLICY "Teachers can approve submissions" ON public.quest_submissions
  FOR UPDATE TO authenticated
  USING (has_role('teacher'::app_role) OR has_role('admin'::app_role));

-- mood_logs SELECT
DROP POLICY "Read own or teacher view moods" ON public.mood_logs;
CREATE POLICY "Read own or teacher view moods" ON public.mood_logs
  FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR has_role('teacher'::app_role) OR has_role('admin'::app_role));

-- kelas XII (update newly created policies to use single-param)
DROP POLICY "Admins can insert kelas XII" ON public."kelas XII";
DROP POLICY "Admins can delete kelas XII" ON public."kelas XII";
DROP POLICY "Admins can update kelas XII" ON public."kelas XII";

CREATE POLICY "Admins can insert kelas XII" ON public."kelas XII"
  FOR INSERT TO authenticated
  WITH CHECK (has_role('admin'::app_role));

CREATE POLICY "Admins can delete kelas XII" ON public."kelas XII"
  FOR DELETE TO authenticated
  USING (has_role('admin'::app_role));

CREATE POLICY "Admins can update kelas XII" ON public."kelas XII"
  FOR UPDATE TO authenticated
  USING (has_role('admin'::app_role))
  WITH CHECK (has_role('admin'::app_role));

-- Drop old two-param function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
