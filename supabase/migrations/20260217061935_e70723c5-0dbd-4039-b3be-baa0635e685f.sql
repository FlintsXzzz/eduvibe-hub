CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      (new.raw_user_meta_data ->> 'first_name') || ' ' || coalesce(new.raw_user_meta_data ->> 'last_name','')
    )
  )
  on conflict (id) do update set name = excluded.name;

  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'student'))
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();