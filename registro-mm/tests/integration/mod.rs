use sqlx::PgPool;
use reqwest::Client;
use registro_mm::config::database::create_pool;
use registro_mm::services::auth_service::AuthService;
use registro_mm::models::user::User;

mod auth_integration {
    use super::*;

    #[tokio::test]
    async fn test_user_registration_and_login_flow() {
        // Configurar pool de banco de dados de teste
        let database_url = std::env::var("DATABASE_TEST_URL")
            .expect("DATABASE_TEST_URL deve ser configurado");
        let pool = PgPool::connect(&database_url).await
            .expect("Falha ao conectar ao banco de dados");

        let auth_service = AuthService::new(pool.clone());
        let http_client = Client::new();

        // Gerar dados de usuário únicos
        let timestamp = chrono::Utc::now().timestamp();
        let username = format!("integration_user_{}", timestamp);
        let email = format!("{}@example.com", username);
        let password = "StrongIntegrationTest123!";

        // Registrar usuário
        let registration_result = auth_service
            .register(&username, &email, password)
            .await
            .expect("Registro de usuário deve ser bem-sucedido");

        assert_eq!(registration_result.username, username);
        assert_eq!(registration_result.email, email);

        // Testar login via serviço
        let login_service_result = auth_service
            .login(&email, password)
            .await
            .expect("Login deve ser bem-sucedido");

        assert!(login_service_result.token.is_some(), "Token JWT deve ser gerado");

        // Testar login via endpoint HTTP
        let login_payload = serde_json::json!({
            "email": email,
            "password": password
        });

        let login_response = http_client
            .post("http://localhost:8000/auth/login")
            .json(&login_payload)
            .send()
            .await
            .expect("Requisição de login deve ser enviada");

        assert!(login_response.status().is_success(), "Endpoint de login deve responder com sucesso");

        let login_response_json: serde_json::Value = login_response
            .json()
            .await
            .expect("Resposta de login deve ser parseável");

        assert!(
            login_response_json.get("token").is_some(), 
            "Resposta de login deve conter token"
        );
    }

    #[tokio::test]
    async fn test_database_connection_pool() {
        let database_url = std::env::var("DATABASE_TEST_URL")
            .expect("DATABASE_TEST_URL deve ser configurado");

        let pool_result = create_pool(&database_url).await;
        assert!(pool_result.is_ok(), "Criação de pool de banco de dados deve ser bem-sucedida");

        let pool = pool_result.unwrap();
        
        // Testar consulta simples
        let result: Result<i64, _> = sqlx::query_scalar("SELECT 1")
            .fetch_one(&pool)
            .await;

        assert!(result.is_ok(), "Consulta básica ao banco de dados deve funcionar");
        assert_eq!(result.unwrap(), 1, "Consulta deve retornar 1");
    }

    #[tokio::test]
    async fn test_password_complexity_validation() {
        let database_url = std::env::var("DATABASE_TEST_URL")
            .expect("DATABASE_TEST_URL deve ser configurado");
        let pool = PgPool::connect(&database_url).await
            .expect("Falha ao conectar ao banco de dados");

        let auth_service = AuthService::new(pool.clone());

        // Testar senhas inválidas
        let weak_passwords = vec![
            "short",
            "123456",
            "password",
            "weakpassword",
        ];

        for password in weak_passwords {
            let registration_result = auth_service
                .register("weakuser", "weak@example.com", password)
                .await;

            assert!(
                registration_result.is_err(), 
                "Registro com senha fraca deve falhar"
            );
        }
    }

    #[tokio::test]
    async fn test_concurrent_registration() {
        let database_url = std::env::var("DATABASE_TEST_URL")
            .expect("DATABASE_TEST_URL deve ser configurado");
        let pool = PgPool::connect(&database_url).await
            .expect("Falha ao conectar ao banco de dados");

        let auth_service = Arc::new(AuthService::new(pool.clone()));

        // Simular registros simultâneos
        let registrations = (0..50).map(|i| {
            let service = Arc::clone(&auth_service);
            let timestamp = chrono::Utc::now().timestamp();
            let username = format!("concurrent_user_{}_{}", timestamp, i);
            let email = format!("{}@example.com", username);

            tokio::spawn(async move {
                service.register(&username, &email, "StrongPassword123!").await
            })
        });

        let results = futures::future::join_all(registrations).await;

        // Verificar que não há falhas inesperadas
        let successful_registrations = results
            .into_iter()
            .filter(|result| 
                result.is_ok() && result.as_ref().unwrap().is_ok()
            )
            .count();

        assert!(
            successful_registrations > 0, 
            "Deve haver registros bem-sucedidos"
        );
    }
}
