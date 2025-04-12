use criterion::{black_box, criterion_group, criterion_main, Criterion};
use reqwest::blocking::Client;
use serde_json::json;
use std::time::Duration;

fn auth_load_test(c: &mut Criterion) {
    let client = Client::new();
    let base_url = "http://localhost:8000";

    let mut group = c.benchmark_group("Authentication Performance");
    group.measurement_time(Duration::from_secs(10));
    group.sample_size(100);

    group.bench_function("login_performance", |b| {
        b.iter(|| {
            let login_payload = json!({
                "username": "testuser",
                "password": "strongpassword"
            });

            let response = client
                .post(format!("{}/login", base_url))
                .json(&login_payload)
                .send()
                .expect("Failed to send login request");

            assert!(response.status().is_success());
        })
    });

    group.bench_function("registration_performance", |b| {
        b.iter(|| {
            let unique_username = format!("user_{}", chrono::Utc::now().timestamp());
            let register_payload = json!({
                "username": unique_username,
                "email": format!("{}@example.com", unique_username),
                "password": "StrongP@ss123"
            });

            let response = client
                .post(format!("{}/register", base_url))
                .json(&register_payload)
                .send()
                .expect("Failed to send registration request");

            assert!(response.status().is_success());
        })
    });

    group.finish();
}

fn database_load_test(c: &mut Criterion) {
    let pool = sqlx::PgPool::connect("postgres://usuario:senha@localhost/registro_mm")
        .await
        .expect("Failed to connect to database");

    let mut group = c.benchmark_group("Database Performance");
    group.measurement_time(Duration::from_secs(10));
    group.sample_size(100);

    group.bench_function("user_insertion", |b| {
        b.iter(|| {
            let username = format!("loadtest_{}", chrono::Utc::now().timestamp());
            let query = sqlx::query!(
                "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
                username,
                format!("{}@test.com", username),
                "hashed_password_placeholder"
            );

            let result = query.execute(&pool).await;
            assert!(result.is_ok());
        })
    });

    group.finish();
}

criterion_group!(benches, auth_load_test, database_load_test);
criterion_main!(benches);
