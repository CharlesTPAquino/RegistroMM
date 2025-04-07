import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ProductController } from './controllers/ProductController';
import { ProductService } from './services/ProductService';
class Server {
    app;
    productController;
    constructor() {
        this.app = express();
        this.configureMiddlewares();
        const productService = new ProductService();
        this.productController = new ProductController(productService);
        this.setupRoutes();
    }
    configureMiddlewares() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    setupRoutes() {
        this.app.post('/products', this.productController.createProduct);
        this.app.get('/products', this.productController.getAllProducts);
    }
    start(port = 8080) {
        this.app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
}
const server = new Server();
server.start();
