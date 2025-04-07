const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

console.log('🔑 Usando chave de serviço:', supabaseServiceKey?.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminNoConfirm() {
  try {
    console.log('🔍 Criando usuário admin6...');

    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin6@exemplo.com',
      password: '12345678',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador',
        role: 'admin'
      }
    });

    if (createError) throw createError;
    console.log('✅ Usuário criado com sucesso:', user);

    // Criar registro na tabela employees
    const { error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          name: 'Administrador',
          email: 'admin6@exemplo.com',
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

createAdminNoConfirm();
