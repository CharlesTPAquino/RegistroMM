export class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    createProduct = async (req, res) => {
        try {
            const { name } = req.body;
            const product = await this.productService.createProduct(name);
            res.status(201).json({ message: 'Produto criado com sucesso', product });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(400).json({ error: errorMessage });
        }
    };
    getAllProducts = async (_req, res) => {
        try {
            const products = await this.productService.getAllProducts();
            res.status(200).json(products);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(500).json({ error: errorMessage });
        }
    };
}
