use rocket::get;
use rocket::serde::json::Json;

#[get("/health")]
pub fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "version": env!("CARGO_PKG_VERSION")
    }))
}
