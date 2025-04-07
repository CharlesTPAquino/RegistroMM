import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.setupRoutes();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Rotas serão adicionadas conforme necessário
  }

  public start(port: number = 8080): void {
    this.app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  }
}

const server = new Server();
server.start();
