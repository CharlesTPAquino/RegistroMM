import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente de forma direta
const supabaseUrl = 'https://hzvxhnyutxqcixfteygs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dnhobnl1dHhxY2l4ZnRleWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjMwNDAsImV4cCI6MjA1OTUzOTA0MH0.jfa3iMa2GycAaGSbPmkBSrSngkBNvZr6q-BJMF5qJGY';

console.log('Inicializando cliente Supabase com URL:', supabaseUrl);

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});