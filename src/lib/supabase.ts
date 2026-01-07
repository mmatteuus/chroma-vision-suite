import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseSchema = import.meta.env.VITE_SUPABASE_SCHEMA ?? "app";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: supabaseSchema },
});

export type SupabaseClientType = typeof supabase;
