import WebSocket from 'ws';
(globalThis as any).WebSocket = WebSocket;

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Variáveis SUPABASE_URL e SUPABASE_ANON_KEY (ou SUPABASE_KEY) são obrigatórias.'
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
