import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

let adminClient;

export const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Falta configurar VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el backend.');
  }

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }

  return adminClient;
};
