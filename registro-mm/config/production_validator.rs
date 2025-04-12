use std::env;
use std::fs;
use std::path::Path;
use sqlx::PgPool;
use secrecy::{Secret, ExposeSecret};

#[derive(Debug)]
pub struct ProductionConfig {
    pub database_url: Secret<String>,
    pub jwt_secret_path: String,
    pub max_connections: u32,
}

impl ProductionConfig {
    pub fn load() -> Result<Self, String> {
        // Validar variáveis de ambiente
        let database_url = env::var("DATABASE_URL")
            .map_err(|_| "DATABASE_URL não configurado")?;

        let jwt_secret_path = env::var("JWT_SECRET_PATH")
            .map_err(|_| "JWT_SECRET_PATH não configurado")?;

        // Validações adicionais
        Self::validate_database_connection(&database_url)?;
        Self::validate_jwt_secret(&jwt_secret_path)?;

        Ok(Self {
            database_url: Secret::new(database_url),
            jwt_secret_path,
            max_connections: 10,
        })
    }

    fn validate_database_connection(url: &str) -> Result<(), String> {
        // Validar conexão com o banco de dados
        let rt = tokio::runtime::Runtime::new()
            .map_err(|e| format!("Erro de runtime: {}", e))?;

        rt.block_on(async {
            match PgPool::connect(url).await {
                Ok(_) => Ok(()),
                Err(e) => Err(format!("Falha na conexão com o banco de dados: {}", e))
            }
        })
    }

    fn validate_jwt_secret(path: &str) -> Result<(), String> {
        // Verificar existência e permissões do arquivo de segredo
        let secret_path = Path::new(path);

        if !secret_path.exists() {
            return Err("Arquivo de segredo JWT não encontrado".to_string());
        }

        let metadata = fs::metadata(secret_path)
            .map_err(|e| format!("Erro ao acessar arquivo de segredo: {}", e))?;

        // Verificar permissões restritas
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let permissions = metadata.permissions();
            if permissions.mode() & 0o777 != 0o600 {
                return Err("Permissões de arquivo de segredo incorretas".to_string());
            }
        }

        // Verificar tamanho do segredo
        let secret_content = fs::read_to_string(secret_path)
            .map_err(|e| format!("Erro ao ler segredo: {}", e))?;

        if secret_content.trim().len() < 32 {
            return Err("Segredo JWT muito curto".to_string());
        }

        Ok(())
    }

    pub fn get_database_connection_pool(&self) -> Result<PgPool, String> {
        let rt = tokio::runtime::Runtime::new()
            .map_err(|e| format!("Erro de runtime: {}", e))?;

        rt.block_on(async {
            PgPool::connect(self.database_url.expose_secret())
                .await
                .map_err(|e| format!("Falha na conexão com o banco de dados: {}", e))
        })
    }

    pub fn security_checks(&self) -> Vec<Result<(), String>> {
        vec![
            self.validate_database_connection(self.database_url.expose_secret()),
            self.validate_jwt_secret(&self.jwt_secret_path),
        ]
    }
}

// Função de validação final
pub fn validate_production_environment() -> Result<(), Vec<String>> {
    let config = match ProductionConfig::load() {
        Ok(cfg) => cfg,
        Err(e) => return Err(vec![e]),
    };

    let security_results = config.security_checks();
    let errors: Vec<String> = security_results
        .into_iter()
        .filter_map(|result| result.err())
        .collect();

    if errors.is_empty() {
        Ok(())
    } else {
        Err(errors)
    }
}

// Exemplo de uso
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_production_config_validation() {
        match validate_production_environment() {
            Ok(_) => println!("Configuração de produção válida"),
            Err(errors) => {
                for error in errors {
                    eprintln!("Erro de configuração: {}", error);
                }
                panic!("Configuração de produção inválida");
            }
        }
    }
}
