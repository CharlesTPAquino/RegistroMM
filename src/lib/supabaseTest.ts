import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Validar variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Variáveis de ambiente do Supabase não configuradas');
  throw new Error('Supabase environment variables are missing');
}

// Criar cliente Supabase com configurações seguras
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: { 'x-my-custom-header': 'production-tracking-system' },
  },
});
