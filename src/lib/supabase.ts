import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente de forma direta
const supabaseUrl = 'https://hzvxhnyutxqcixfteygs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dnhobnl1dHhxY2l4ZnRleWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjMwNDAsImV4cCI6MjA1OTUzOTA0MH0.jfa3iMa2GycAaGSbPmkBSrSngkBNvZr6q-BJMF5qJGY';

console.log('Inicializando cliente Supabase com URL:', supabaseUrl);

// Função para verificar se o localStorage está disponível
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__supabase_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('localStorage não está disponível:', e);
    return false;
  }
};

// Opções do cliente Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: isLocalStorageAvailable(),
    detectSessionInUrl: true,
    storage: isLocalStorageAvailable() 
      ? localStorage 
      : {
          getItem: (key: string) => {
            console.log(`Tentando acessar ${key} do armazenamento alternativo`);
            return null;
          },
          setItem: (key: string, _value: string) => {
            console.log(`Tentando armazenar ${key} no armazenamento alternativo`);
          },
          removeItem: (key: string) => {
            console.log(`Tentando remover ${key} do armazenamento alternativo`);
          }
        }
  }
};

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);