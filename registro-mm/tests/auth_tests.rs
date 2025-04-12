#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::PgPool;
    use mockall::predicate::*;
    use mockall::*;

    mock! {
        AuthService {}
        impl AuthService {
            async fn register(&self, username: String, email: String, password: String) -> Result<User, sqlx::Error>;
            async fn login(&self, email: &str, password: &str) -> Result<String, String>;
            fn validate_token(&self, token: &str) -> Result<Claims, String>;
        }
    }

    #[tokio::test]
    async fn test_user_registration() {
        let pool = PgPool::connect("postgres://usuario:senha@localhost/registro_mm")
            .await
            .expect("Failed to connect to database");

        let auth_service = AuthService::new(pool);
        
        let result = auth_service.register(
            "testuser".to_string(), 
            "test@example.com".to_string(), 
            "strongpassword".to_string()
        ).await;

        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_user_login() {
        let pool = PgPool::connect("postgres://usuario:senha@localhost/registro_mm")
            .await
            .expect("Failed to connect to database");

        let auth_service = AuthService::new(pool);
        
        let result = auth_service.login("test@example.com", "strongpassword").await;
        
        assert!(result.is_ok());
    }
}
