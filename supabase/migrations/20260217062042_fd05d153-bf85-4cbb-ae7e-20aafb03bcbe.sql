-- Fix the audit trigger to handle empty auth.uid() during signup
CREATE OR REPLACE FUNCTION public.auth_users_audit_trigger_fn()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $$
DECLARE
  v_uid uuid;
BEGIN
  BEGIN
    v_uid := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_uid := NULL;
  END;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.auth_users_audit(user_id, operation, changed_by, old_data, new_data)
    VALUES (NEW.id, TG_OP, v_uid, NULL, row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.auth_users_audit(user_id, operation, changed_by, old_data, new_data)
    VALUES (NEW.id, TG_OP, v_uid, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.auth_users_audit(user_id, operation, changed_by, old_data, new_data)
    VALUES (OLD.id, TG_OP, v_uid, row_to_json(OLD)::jsonb, NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;