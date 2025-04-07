import { createClient } from '@supabase/supabase-js';
// Validar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERRO: Variáveis de ambiente do Supabase não configuradas');
    throw new Error('Supabase environment variables are missing');
}
// Criar cliente Supabase com configurações seguras
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false
    },
    global: {
        headers: { 'x-my-custom-header': 'production-tracking-system' },
    },
});
// Configurar acesso público para as tabelas
async function setupPublicAccess() {
    try {
        console.log('Iniciando configuração de acesso público');
        // Testar conexão básica
        const { data, error } = await supabase.rpc('setup_public_access');
        if (error) {
            console.error('Erro ao testar conexão com tabela employees:', error);
            return false;
        }
        console.log('Conexão com employees testada com sucesso', data);
        return true;
    }
    catch (error) {
        console.error('Erro inesperado ao configurar acesso público:', error);
        return false;
    }
}
// Executar a configuração
setupPublicAccess();
export { supabase, setupPublicAccess };
