import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Credentials come from the build environment (Vercel env vars, or a local
// .env.local). The VITE_ prefix means Vite inlines them into the public
// bundle at build time - that is expected for a browser client.
//
// The Supabase publishable/anon key is designed to be public. The actual
// access control is RLS policy coverage on the database, not secrecy here.
// See .env.example for the required variable names.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Note: this guard runs when the module is evaluated in the browser, not during
// `vite build`. A build with missing env vars still succeeds; the app throws on
// load instead. Set the vars in the deployment environment or the app will
// white-screen at runtime.
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY in .env.local (see .env.example) or in the ' +
      'deployment environment.',
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
