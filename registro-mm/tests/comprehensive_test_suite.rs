use sqlx::PgPool;
use registro_mm::models::user::User;
use registro_mm::services::auth_service::AuthService;
use registro_mm::errors::AppError;
use registro_mm::config::database::create_pool;

#[tokio::test]
async fn test_full_user_lifecycle() {
    // Configuração do ambiente de teste
    let database_url = std::env::var("DATABASE_TEST_URL")
        .expect("DATABASE_TEST_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();

    let auth_service = AuthService::new(pool.clone());

    // Teste de registro
    let username = format!("testuser_{}", chrono::Utc::now().timestamp());
    let email = format!("{}@example.com", username);
    let password = "StrongPassword123!";

    let registration_result = auth_service
        .register(&username, &email, password)
        .await;

    assert!(registration_result.is_ok(), "Registro de usuário deve ser bem-sucedido");

    // Teste de login
    let login_result = auth_service
        .login(&email, password)
        .await;

    assert!(login_result.is_ok(), "Login deve ser bem-sucedido");

    // Teste de autenticação inválida
    let invalid_login = auth_service
        .login(&email, "WrongPassword")
        .await;

    assert!(invalid_login.is_err(), "Login com senha incorreta deve falhar");
}

#[tokio::test]
async fn test_password_complexity() {
    let database_url = std::env::var("DATABASE_TEST_URL")
        .expect("DATABASE_TEST_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();

    let auth_service = AuthService::new(pool.clone());

    // Senhas muito curtas
    let weak_passwords = vec![
        "short",
        "123456",
        "password",
    ];

    for password in weak_passwords {
        let result = auth_service
            .register("weakuser", "weak@example.com", password)
            .await;

        assert!(result.is_err(), "Registro com senha fraca deve falhar");
    }
}

#[tokio::test]
async fn test_duplicate_registration() {
    let database_url = std::env::var("DATABASE_TEST_URL")
        .expect("DATABASE_TEST_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();

    let auth_service = AuthService::new(pool.clone());

    let username = format!("duplicateuser_{}", chrono::Utc::now().timestamp());
    let email = format!("{}@example.com", username);
    let password = "StrongPassword123!";

    // Primeiro registro
    let first_registration = auth_service
        .register(&username, &email, password)
        .await;

    assert!(first_registration.is_ok(), "Primeiro registro deve ser bem-sucedido");

    // Tentativa de registro duplicado
    let duplicate_registration = auth_service
        .register(&username, &email, password)
        .await;

    assert!(duplicate_registration.is_err(), "Registro duplicado deve falhar");
}

#[tokio::test]
async fn test_jwt_token_generation() {
    let database_url = std::env::var("DATABASE_TEST_URL")
        .expect("DATABASE_TEST_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();

    let auth_service = AuthService::new(pool.clone());

    let username = format!("tokenuser_{}", chrono::Utc::now().timestamp());
    let email = format!("{}@example.com", username);
    let password = "StrongPassword123!";

    let registration_result = auth_service
        .register(&username, &email, password)
        .await
        .expect("Registro deve ser bem-sucedido");

    let login_result = auth_service
        .login(&email, password)
        .await
        .expect("Login deve ser bem-sucedido");

    assert!(login_result.token.is_some(), "Token JWT deve ser gerado");
    
    // Validação básica do token
    let token = login_result.token.unwrap();
    assert!(token.len() > 50, "Token JWT deve ter comprimento adequado");
}

#[tokio::test]
async fn test_performance_under_load() {
    use std::time::Instant;

    let database_url = std::env::var("DATABASE_TEST_URL")
        .expect("DATABASE_TEST_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();

    let auth_service = AuthService::new(pool.clone());

    let start = Instant::now();
    
    // Simular múltiplos registros simultâneos
    let registrations = (0..50).map(|i| {
        let username = format!("loaduser_{}_{}", chrono::Utc::now().timestamp(), i);
        let email = format!("{}@example.com", username);
        auth_service.register(&username, &email, "StrongPassword123!")
    });

    let results = futures::future::join_all(registrations).await;

    let duration = start.elapsed();

    // Verificar que todos os registros foram bem-sucedidos
    assert!(results.iter().all(|r| r.is_ok()), "Todos registros devem ser bem-sucedidos");
    
    // Verificar que o tempo total é razoável
    assert!(duration.as_secs() < 10, "Registros simultâneos devem ser rápidos");
}
