# Guia de Contribuição para Registro MM 🤝

## Índice
1. [Configuração do Ambiente](#configuração-do-ambiente)
2. [Fluxo de Trabalho](#fluxo-de-trabalho)
3. [Padrões de Código](#padrões-de-código)
4. [Testes](#testes)
5. [Processo de Revisão](#processo-de-revisão)

## Configuração do Ambiente

### Pré-requisitos
- Rust 1.68+
- PostgreSQL 13+
- Git
- Docker (opcional)

### Passos de Instalação
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/registro-mm.git
cd registro-mm

# Instalar dependências
cargo build

# Configurar banco de dados
sqlx migrate run

# Executar testes
cargo test
```

## Fluxo de Trabalho

### Branches
- `main`: Código estável
- `develop`: Branch de desenvolvimento
- `feature/`: Para novas funcionalidades
- `bugfix/`: Para correções de bugs

### Processo de Contribuição
1. Faça fork do repositório
2. Crie uma branch de feature
3. Implemente suas mudanças
4. Escreva testes
5. Garanta que todos os testes passem
6. Faça um Pull Request

## Padrões de Código

### Rust
- Siga [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/README.html)
- Use `rustfmt` para formatação
- Utilize `clippy` para análise estática

### Exemplos
```rust
// Bom exemplo
fn calculate_total(items: &[Item]) -> f64 {
    items.iter().map(|item| item.price).sum()
}

// Evite
fn bad_function() -> Result<(), Error> {
    // Código sem tratamento adequado de erros
}
```

## Testes

### Tipos de Testes
- Unitários
- Integração
- Testes de Carga
- Testes de Segurança

### Executando Testes
```bash
# Testes unitários
cargo test

# Testes de integração
cargo test --test integration

# Testes de carga
cargo bench
```

## Processo de Revisão

### Critérios de Revisão
- Cobertura de testes
- Qualidade do código
- Documentação
- Impacto na performance
- Segurança

### Checklist de Pull Request
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Código revisado
- [ ] Sem regressões

## Código de Conduta
- Respeite outros contribuidores
- Mantenha discussões construtivas
- Seja inclusivo

## Dúvidas?
Abra uma issue no GitHub ou entre em contato: contato@registromm.com

---
Última atualização: 11/04/2025
