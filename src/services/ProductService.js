export class ProductService {
    products = [];
    async createProduct(name) {
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
    async getAllProducts() {
        return this.products;
    }
}
