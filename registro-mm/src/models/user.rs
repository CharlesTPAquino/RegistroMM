use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl User {
    pub fn new(username: String, email: String, password: String) -> Result<Self, argon2::password_hash::Error> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        
        let password_hash = argon2.hash_password(
            password.as_bytes(), 
            &salt
        )?.to_string();

        Ok(Self {
            id: 0, // Será definido pelo banco de dados
            username,
            email,
            password_hash,
            created_at: chrono::Utc::now(),
        })
    }

    pub fn verify_password(&self, password: &str) -> bool {
        let parsed_hash = PasswordHash::new(&self.password_hash).unwrap();
        Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok()
    }
}
