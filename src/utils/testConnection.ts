import 'dotenv/config';
import connectDB from '../lib/mongodb';
import { mongoService } from '../services/mongoService';

async function testConnection() {
  try {
    // Testa a conexão
    await connectDB();
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');

    // Testa a criação de um produto
    const testProduct = await mongoService.createProduct({
      name: 'Produto Teste'
    });
    console.log('✅ Produto de teste criado:', testProduct);

    // Testa a busca de produtos
    const products = await mongoService.getProducts();
    console.log('✅ Produtos encontrados:', products);

    // Testa a atualização do produto
    const updatedProduct = await mongoService.updateProduct(testProduct.id, {
      name: 'Produto Teste Atualizado'
    });
    console.log('✅ Produto atualizado:', updatedProduct);

    // Testa a deleção do produto
    await mongoService.deleteProduct(testProduct.id);
    console.log('✅ Produto de teste removido com sucesso!');

    console.log('✅ Todos os testes completados com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    process.exit();
  }
}

testConnection();
