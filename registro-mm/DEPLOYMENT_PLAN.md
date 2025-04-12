# Plano de Implantação - Registro MM 🚀

## Visão Geral
Guia detalhado para implantação segura e eficiente do Registro MM.

## Ambientes
1. **Desenvolvimento**: Localhost
2. **Staging**: Ambiente de teste
3. **Produção**: Servidor final

## Pré-Requisitos
- Servidor Linux (Ubuntu 22.04+)
- PostgreSQL 13+
- Nginx
- Certbot (Let's Encrypt)
- Docker (opcional)

## Etapas de Implantação

### 1. Preparação do Servidor
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y postgresql nginx certbot

# Configurar firewall
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Configuração do Banco de Dados
```bash
# Criar usuário e banco de dados
sudo -u postgres psql
CREATE USER registromm WITH PASSWORD 'SENHA_SEGURA';
CREATE DATABASE registromm_prod;
GRANT ALL PRIVILEGES ON DATABASE registromm_prod TO registromm;
```

### 3. Configuração da Aplicação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/registro-mm.git
cd registro-mm

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com configurações de produção

# Build da aplicação
cargo build --release

# Configurar migrations
sqlx migrate run
```

### 4. Configuração do Nginx
```nginx
server {
    listen 80;
    server_name api.registromm.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. Configurar HTTPS
```bash
# Obter certificado
sudo certbot --nginx -d api.registromm.com
```

### 6. Serviço Systemd
```systemd
[Unit]
Description=Registro MM API
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/path/to/registro-mm
ExecStart=/path/to/registro-mm/target/release/registro-mm
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Estratégia de Rollback
1. Manter binário anterior
2. Restaurar banco de dados do backup
3. Reverter para versão anterior

## Monitoramento Pós-Implantação
- Logs: `/var/log/registro-mm/`
- Métricas: Prometheus + Grafana
- Alertas: Sentry, UptimeRobot

## Checklist Final
- [ ] Testes de aceitação concluídos
- [ ] Configurações de segurança validadas
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Documentação atualizada

## Próximos Passos
- Configurar backup automático
- Implementar monitoramento avançado
- Planejar próxima release

---
Última atualização: 12/04/2025
