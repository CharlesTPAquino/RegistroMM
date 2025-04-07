import { supabase } from '../lib/supabaseTest';

async function testSupabase() {
  try {
    console.log(' Iniciando testes do Supabase...');

    // Teste 1: Criar um funcionário
    console.log('\n Teste 1: Criando funcionário...');
    const timestamp = new Date().getTime();
    const employee = await supabase
      .from('employees')
      .insert([{
        name: 'Funcionário Teste',
        email: `teste${timestamp}@exemplo.com`,
        role: 'Operador'
      }])
      .select()
      .single();

    if (employee.error) throw employee.error;
    console.log(' Funcionário criado:', employee.data);

    // Teste 2: Criar um produto
    console.log('\n Teste 2: Criando produto...');
    const product = await supabase
      .from('products')
      .insert([{
        name: `Produto Teste ${timestamp}`
      }])
      .select()
      .single();

    if (product.error) throw product.error;
    console.log(' Produto criado:', product.data);

    // Teste 3: Criar um registro de produção
    console.log('\n Teste 3: Criando registro de produção...');
    const productionRecord = await supabase
      .from('production_records')
      .insert([{
        employee_id: employee.data.id,
        product_id: product.data.id,
        order_number: `TESTE-${timestamp}`,
        batch_number: `LOTE-${timestamp}`,
        production_date: new Date().toISOString().split('T')[0],
        status: 'Em andamento',
        start_time: new Date().toISOString()
      }])
      .select()
      .single();

    if (productionRecord.error) throw productionRecord.error;
    console.log(' Registro de produção criado:', productionRecord.data);

    // Teste 4: Buscar todos os registros
    console.log('\n Teste 4: Buscando registros...');
    const [employees, products, records] = await Promise.all([
      supabase.from('employees').select('*'),
      supabase.from('products').select('*'),
      supabase.from('production_records').select('*')
    ]);

    if (employees.error) throw employees.error;
    if (products.error) throw products.error;
    if (records.error) throw records.error;

    console.log(' Funcionários encontrados:', employees.data.length);
    console.log(' Produtos encontrados:', products.data.length);
    console.log(' Registros de produção encontrados:', records.data.length);

    // Teste 5: Atualizar status do registro
    console.log('\n Teste 5: Atualizando status do registro...');
    const updatedRecord = await supabase
      .from('production_records')
      .update({
        status: 'Concluído',
        completion_date: new Date().toISOString()
      })
      .eq('id', productionRecord.data.id)
      .select()
      .single();

    if (updatedRecord.error) throw updatedRecord.error;
    console.log(' Registro atualizado:', updatedRecord.data);

    // Teste 6: Limpar dados de teste
    console.log('\n Limpando dados de teste...');
    await Promise.all([
      supabase.from('production_records').delete().eq('id', productionRecord.data.id),
      supabase.from('products').delete().eq('id', product.data.id),
      supabase.from('employees').delete().eq('id', employee.data.id)
    ]);
    console.log(' Dados de teste removidos');

    console.log('\n Todos os testes completados com sucesso!');
  } catch (error) {
    console.error('\n Erro durante os testes:', error);
  } finally {
    process.exit();
  }
}

testSupabase();
