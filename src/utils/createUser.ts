const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('🔍 Criando usuário admin...');
    
    // Criar usuário usando signup
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: 'admin@exemplo.com',
      password: 'admin123',
      options: {
        data: {
          name: 'Administrador',
          role: 'admin'
        }
      }
    });

    if (userError) throw userError;
    console.log('✅ Usuário criado:', userData);

    // Criar registro na tabela employees
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          name: 'Administrador',
          email: 'admin@exemplo.com',
          role: 'admin'
        }
      ])
      .select();

    if (employeeError) throw employeeError;
    console.log('✅ Funcionário criado:', employeeData);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
