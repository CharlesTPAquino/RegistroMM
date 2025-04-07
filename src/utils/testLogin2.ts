const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('🔍 Testando login...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseAnonKey);

    // Tentar fazer login
    console.log('\n1. Tentando fazer login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin5@exemplo.com',
      password: '12345678'
    });

    if (error) {
      console.error('❌ Erro ao fazer login:', error);
      console.error('Detalhes:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      return;
    }

    console.log('✅ Login bem sucedido!');
    console.log('Dados da sessão:', data);

    // Testar acesso aos dados
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
  } finally {
    process.exit();
  }
}

testLogin();
