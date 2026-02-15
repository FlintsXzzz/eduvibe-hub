
-- Fix RLS on pre-existing tables that have no policies
CREATE POLICY "Authenticated can read kelas X" ON public."kelas X"
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read kelas XI" ON public."kelas XI"
  FOR SELECT TO authenticated USING (true);
