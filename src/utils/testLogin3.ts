import { createClient } from '@supabase/supabase-js';

// Credenciais hardcoded para teste
const supabaseUrl = 'https://hzvxhnyutxqcixfteygs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dnhobnl1dHhxY2l4ZnRleWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjMwNDAsImV4cCI6MjA1OTUzOTA0MH0.jfa3iMa2GycAaGSbPmkBSrSngkBNvZr6q-BJMF5qJGY';

console.log('🔍 Testando login...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey);

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

async function testLogin() {
  try {
    console.log('\n1. Tentando fazer login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin5@exemplo.com',
      password: '12345678'
    });

    if (error) {
      console.error('❌ Erro no login:', error);
      return;
    }

    console.log('✅ Login bem sucedido!');
    console.log('Dados da sessão:', data);

    console.log('\n2. Testando acesso aos dados...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .limit(1);

    if (employeesError) {
      console.error('❌ Erro ao acessar employees:', employeesError);
      return;
    }

    console.log('✅ Acesso aos dados funcionando!');
    console.log('Primeiro funcionário:', employees[0]);

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testLogin();
