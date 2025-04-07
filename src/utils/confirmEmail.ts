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

async function confirmEmail() {
  try {
    console.log('🔍 Buscando usuário...');

    // Primeiro, vamos tentar fazer login com o usuário
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin5@exemplo.com',
      password: '12345678'
    });

    if (signInError) throw signInError;
    if (!user) throw new Error('Usuário não encontrado');

    console.log('✅ Usuário encontrado:', user.id);

    // Agora vamos atualizar o usuário para confirmar o email
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { email_confirmed: true } }
    );

    if (updateError) throw updateError;

    console.log('✅ Email confirmado com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

confirmEmail();
