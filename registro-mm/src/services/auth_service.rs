use crate::models::user::User;
use jsonwebtoken::{
    encode, Header, EncodingKey, 
    decode, DecodingKey, Validation
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::env;
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iat: usize,
}

pub struct AuthService {
    db_pool: PgPool,
}

impl AuthService {
    pub fn new(pool: PgPool) -> Self {
        Self { db_pool: pool }
    }

    pub async fn register(&self, username: String, email: String, password: String) -> Result<User, sqlx::Error> {
        let user = User::new(username, email, password)?;
        
        let user = sqlx::query_as!(
            User,
            "INSERT INTO users (username, email, password_hash, created_at) 
             VALUES ($1, $2, $3, $4) RETURNING *",
            user.username,
            user.email,
            user.password_hash,
            user.created_at
        )
        .fetch_one(&self.db_pool)
        .await?;

        Ok(user)
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<String, String> {
        let user = sqlx::query_as!(
            User,
            "SELECT * FROM users WHERE email = $1",
            email
        )
        .fetch_one(&self.db_pool)
        .await
        .map_err(|_| "User not found".to_string())?;

        if user.verify_password(password) {
            Ok(self.generate_token(&user.id.to_string()))
        } else {
            Err("Invalid credentials".to_string())
        }
    }

    fn generate_token(&self, user_id: &str) -> String {
        let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let now = Utc::now();
        let iat = now.timestamp() as usize;
        let exp = (now + Duration::hours(24)).timestamp() as usize;

        let claims = Claims {
            sub: user_id.to_string(),
            exp,
            iat,
        };

        encode(
            &Header::default(), 
            &claims, 
            &EncodingKey::from_secret(secret.as_ref())
        ).expect("Failed to generate token")
    }

    pub fn validate_token(&self, token: &str) -> Result<Claims, String> {
        let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        
        decode::<Claims>(
            token, 
            &DecodingKey::from_secret(secret.as_ref()),
            &Validation::default()
        )
        .map(|data| data.claims)
        .map_err(|_| "Invalid token".to_string())
    }
}
