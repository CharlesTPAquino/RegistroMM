use sqlx::PgPool;
use registro_mm::services::auth_service::AuthService;
use registro_mm::models::user::User;

#[tokio::test]
async fn test_user_registration_flow() {
    // Configurar conexão com banco de dados de teste
    let pool = PgPool::connect("postgres://usuario:senha@localhost/registro_mm_test")
        .await
        .expect("Falha ao conectar no banco de dados de teste");

    let auth_service = AuthService::new(pool.clone());

    // Teste de registro de usuário
    let username = format!("testuser_{}", chrono::Utc::now().timestamp());
    let email = format!("{}@example.com", username);
    
    let registration_result = auth_service.register(
        username.clone(), 
        email.clone(), 
        "StrongP@ss123".to_string()
    ).await;

    assert!(registration_result.is_ok(), "Registro de usuário deve ser bem-sucedido");
    
    let registered_user = registration_result.unwrap();
    assert_eq!(registered_user.username, username);
    assert_eq!(registered_user.email, email);

    // Teste de login
    let login_result = auth_service.login(&email, "StrongP@ss123").await;
    assert!(login_result.is_ok(), "Login deve ser bem-sucedido");

    // Teste de token
    let token = login_result.unwrap();
    let validation_result = auth_service.validate_token(&token);
    assert!(validation_result.is_ok(), "Validação de token deve ser bem-sucedida");
}

#[tokio::test]
async fn test_duplicate_registration() {
    let pool = PgPool::connect("postgres://usuario:senha@localhost/registro_mm_test")
        .await
        .expect("Falha ao conectar no banco de dados de teste");

    let auth_service = AuthService::new(pool.clone());

    let username = format!("duplicateuser_{}", chrono::Utc::now().timestamp());
    let email = format!("{}@example.com", username);

    // Primeiro registro
    let first_registration = auth_service.register(
        username.clone(), 
        email.clone(), 
        "StrongP@ss123".to_string()
    ).await;

    assert!(first_registration.is_ok(), "Primeiro registro deve ser bem-sucedido");

    // Tentativa de registro duplicado
    let duplicate_registration = auth_service.register(
        username, 
        email, 
        "AnotherStrongP@ss456".to_string()
    ).await;

    assert!(duplicate_registration.is_err(), "Registro duplicado deve falhar");
}

#[tokio::test]
async fn test_invalid_login() {
    let pool = PgPool::connect("postgres://usuario:senha@localhost/registro_mm_test")
        .await
        .expect("Falha ao conectar no banco de dados de teste");

    let auth_service = AuthService::new(pool.clone());

    // Tentativa de login com credenciais inexistentes
    let login_result = auth_service.login("nonexistent@example.com", "wrongpassword").await;
    
    assert!(login_result.is_err(), "Login com credenciais inválidas deve falhar");
}
