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

async function confirmEmailAdmin() {
  try {
    console.log('🔍 Buscando usuário...');

    // Primeiro, vamos listar todos os usuários
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) throw listError;

    const adminUser = users.find(u => u.email === 'admin7@exemplo.com');
    if (!adminUser) {
      throw new Error('Usuário não encontrado');
    }

    console.log('✅ Usuário encontrado:', adminUser.id);

    // Agora vamos atualizar o usuário para confirmar o email
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { email_confirmed: true }
    );

    if (updateError) throw updateError;

    console.log('✅ Email confirmado com sucesso!');
    console.log('Dados atualizados:', data);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

confirmEmailAdmin();
