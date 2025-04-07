const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminFinal() {
  try {
    console.log('🔍 Criando usuário admin...');

    // Criar usuário usando signup
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'admin8@exemplo.com',
      password: 'admin123',
      options: {
        data: {
          name: 'Admin',
          role: 'admin',
          email_confirmed: true
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    console.log('✅ Usuário criado com sucesso:', user);

    // Tentar fazer login imediatamente
    console.log('🔍 Testando login...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin8@exemplo.com',
      password: 'admin123'
    });

    if (loginError) {
      throw loginError;
    }

    console.log('✅ Login bem sucedido:', loginData);

    // Criar registro na tabela employees
    const { error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          name: 'Admin',
          email: 'admin8@exemplo.com',
          role: 'admin'
        }
      ]);

    if (employeeError) {
      console.log('⚠️ Erro ao criar funcionário (pode já existir):', employeeError);
    } else {
      console.log('✅ Registro de funcionário criado com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

createAdminFinal();
