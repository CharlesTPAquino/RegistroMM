export class ProductService {
  private products: string[] = [];

  async createProduct(name: string): Promise<string> {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do produto inválido');
    }

    const trimmedName = name.trim();
    
    if (this.products.includes(trimmedName)) {
      throw new Error('Produto já existe');
    }

    this.products.push(trimmedName);
    return trimmedName;
  }

  async getAllProducts(): Promise<string[]> {
    return this.products;
  }
}
