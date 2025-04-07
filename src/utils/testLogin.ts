const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

console.log('🔑 Usando:', {
  url: supabaseUrl,
  key: supabaseAnonKey?.substring(0, 10) + '...'
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('🔍 Testando login...');
    
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin7@exemplo.com',
      password: 'admin123'
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
    console.log('Dados do usuário:', data);

    // Testar acesso aos dados
    console.log('🔍 Testando acesso aos dados...');
    
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
