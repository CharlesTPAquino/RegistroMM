# Registro MM 🚀

## Visão Geral
Sistema de autenticação seguro e escalável construído com Rust e Rocket.

## Tecnologias
- 🦀 Rust
- 🚀 Rocket Framework
- 🔐 JWT Authentication
- 🗄️ PostgreSQL
- 🧪 SQLx

## Recursos
- Registro de usuário
- Autenticação JWT
- Validação de entrada
- Criptografia de senhas
- Monitoramento de desempenho

## Pré-requisitos
- Rust 1.68+
- PostgreSQL 13+
- Docker (opcional)

## Instalação Rápida
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/registro-mm.git

# Instalar dependências
cargo build

# Configurar banco de dados
sqlx migrate run

# Executar testes
cargo test

# Iniciar servidor
cargo run
```

## Configuração
Copie `.env.example` para `.env` e configure:
- `DATABASE_URL`
- `JWT_SECRET`

## Documentação
- [Guia de Contribuição](CONTRIBUTING.md)
- [Especificação da API](docs/api_spec.yaml)

## Licença
MIT License

## Contato
contato@registromm.com
