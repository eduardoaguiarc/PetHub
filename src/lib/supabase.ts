import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://kzdxuzqzjatrvpeofogz.supabase.co';
const FALLBACK_KEY = 'sb_publishable_qd6RAAcZImeECAXB78wbEw_Lhp1dxxO';

const candidateUrl = (import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL)
  .replace(/['"]/g, '')
  .trim();

export const supabaseUrl = /^https?:\/\/.+/i.test(candidateUrl)
  ? candidateUrl
  : FALLBACK_URL;

export const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY
)
  .replace(/['"]/g, '')
  .trim() || FALLBACK_KEY;

export const SUPABASE_URL = supabaseUrl;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
