import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); 

const SUPBASEURL = process.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = process.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(SUPBASEURL, SUPABASE_API_KEY);