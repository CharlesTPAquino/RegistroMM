const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'admin5@exemplo.com',
      password: '12345678',
      options: {
        data: {
          name: 'Administrador',
          role: 'admin'
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    console.log('✅ Usuário criado com sucesso:', user);

    // Criar registro na tabela employees
    const { error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          name: 'Administrador',
          email: 'admin5@exemplo.com',
          role: 'admin'
        }
      ]);

    if (employeeError) {
      throw employeeError;
    }

    console.log('✅ Registro de funcionário criado com sucesso!');
    console.log('\nAgora você pode fazer login com:');
    console.log('Email: admin5@exemplo.com');
    console.log('Senha: 12345678');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

createAdminUser();
