use rocket::post;
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    token: String,
    success: bool,
}

#[post("/login", format = "json", data = "<login_request>")]
pub fn login(login_request: Json<LoginRequest>) -> Json<LoginResponse> {
    // TODO: Implementar lógica real de autenticação
    Json(LoginResponse {
        token: "dummy_token".to_string(),
        success: true,
    })
}

#[post("/register", format = "json", data = "<register_request>")]
pub fn register(register_request: Json<LoginRequest>) -> Json<LoginResponse> {
    // TODO: Implementar lógica real de registro
    Json(LoginResponse {
        token: "dummy_token".to_string(),
        success: true,
    })
}
