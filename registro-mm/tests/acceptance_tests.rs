use reqwest::Client;
use serde_json::json;
use std::time::Duration;

#[tokio::test]
async fn test_user_registration_flow() {
    let client = Client::new();
    let base_url = std::env::var("API_BASE_URL")
        .unwrap_or_else(|_| "http://localhost:8000".to_string());

    // Gerar usuário único
    let timestamp = chrono::Utc::now().timestamp();
    let username = format!("acceptance_user_{}", timestamp);
    let email = format!("{}@example.com", username);
    let password = "StrongAcceptanceTest123!";

    // Teste de registro
    let register_payload = json!({
        "username": username,
        "email": email,
        "password": password
    });

    let register_response = client
        .post(format!("{}/auth/register", base_url))
        .json(&register_payload)
        .send()
        .await
        .expect("Falha na requisição de registro");

    assert!(
        register_response.status().is_success(), 
        "Registro de usuário deve ser bem-sucedido"
    );

    let register_result = register_response
        .json::<serde_json::Value>()
        .await
        .expect("Falha ao parsear resposta de registro");

    // Verificar campos de resposta
    assert!(register_result.get("user").is_some(), "Resposta deve conter informações do usuário");
    assert!(register_result.get("token").is_some(), "Resposta deve conter token JWT");

    // Teste de login
    let login_payload = json!({
        "email": email,
        "password": password
    });

    let login_response = client
        .post(format!("{}/auth/login", base_url))
        .json(&login_payload)
        .send()
        .await
        .expect("Falha na requisição de login");

    assert!(
        login_response.status().is_success(), 
        "Login deve ser bem-sucedido"
    );

    let login_result = login_response
        .json::<serde_json::Value>()
        .await
        .expect("Falha ao parsear resposta de login");

    assert!(login_result.get("token").is_some(), "Login deve retornar token JWT");
}

#[tokio::test]
async fn test_health_endpoint() {
    let client = Client::builder()
        .timeout(Duration::from_secs(10))
        .build()
        .unwrap();

    let base_url = std::env::var("API_BASE_URL")
        .unwrap_or_else(|_| "http://localhost:8000".to_string());

    let health_response = client
        .get(format!("{}/health", base_url))
        .send()
        .await
        .expect("Falha na requisição de health check");

    assert!(
        health_response.status().is_success(), 
        "Endpoint de health check deve responder"
    );

    let health_result = health_response
        .json::<serde_json::Value>()
        .await
        .expect("Falha ao parsear resposta de health check");

    assert_eq!(
        health_result.get("status"), 
        Some(&json!("healthy")), 
        "Status de saúde deve ser 'healthy'"
    );
}

#[tokio::test]
async fn test_authentication_error_scenarios() {
    let client = Client::new();
    let base_url = std::env::var("API_BASE_URL")
        .unwrap_or_else(|_| "http://localhost:8000".to_string());

    // Tentativa de login com credenciais inválidas
    let invalid_login_payload = json!({
        "email": "nonexistent@example.com",
        "password": "WrongPassword123"
    });

    let invalid_login_response = client
        .post(format!("{}/auth/login", base_url))
        .json(&invalid_login_payload)
        .send()
        .await
        .expect("Falha na requisição de login inválido");

    assert!(
        invalid_login_response.status().is_unauthorized(), 
        "Login com credenciais inválidas deve ser rejeitado"
    );

    // Tentativa de registro com email inválido
    let invalid_register_payload = json!({
        "username": "invaliduser",
        "email": "invalid-email",
        "password": "ShortPass"
    });

    let invalid_register_response = client
        .post(format!("{}/auth/register", base_url))
        .json(&invalid_register_payload)
        .send()
        .await
        .expect("Falha na requisição de registro inválido");

    assert!(
        invalid_register_response.status().is_bad_request(), 
        "Registro com dados inválidos deve ser rejeitado"
    );
}

#[tokio::test]
async fn test_rate_limiting() {
    let client = Client::new();
    let base_url = std::env::var("API_BASE_URL")
        .unwrap_or_else(|_| "http://localhost:8000".to_string());

    let login_payload = json!({
        "email": "ratelimit@example.com",
        "password": "StrongPassword123!"
    });

    // Simular múltiplas requisições rápidas
    let requests = (0..10).map(|_| {
        client
            .post(format!("{}/auth/login", base_url))
            .json(&login_payload)
            .send()
    });

    let responses = futures::future::join_all(requests).await;

    // Verificar se algumas requisições são limitadas
    let rate_limited_responses = responses
        .iter()
        .filter(|r| r.as_ref().unwrap().status() == reqwest::StatusCode::TOO_MANY_REQUESTS)
        .count();

    assert!(
        rate_limited_responses > 0, 
        "Deve haver limitação de taxa para múltiplas requisições"
    );
}
