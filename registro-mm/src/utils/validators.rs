use regex::Regex;
use validator::Validate;

#[derive(Debug, Validate)]
pub struct UserRegistration {
    #[validate(
        length(min = 3, max = 50, message = "Username must be between 3 and 50 characters"),
        regex(path = "USERNAME_REGEX", message = "Invalid username format")
    )]
    pub username: String,

    #[validate(
        email(message = "Invalid email format"),
        length(max = 100, message = "Email is too long")
    )]
    pub email: String,

    #[validate(
        length(min = 8, message = "Password must be at least 8 characters long"),
        custom(function = "validate_password_complexity")
    )]
    pub password: String,
}

lazy_static! {
    static ref USERNAME_REGEX: Regex = Regex::new(r"^[a-zA-Z0-9_-]+$").unwrap();
}

fn validate_password_complexity(password: &str) -> Result<(), validator::ValidationError> {
    let mut has_uppercase = false;
    let mut has_lowercase = false;
    let mut has_digit = false;
    let mut has_special = false;

    for char in password.chars() {
        if char.is_uppercase() { has_uppercase = true; }
        if char.is_lowercase() { has_lowercase = true; }
        if char.is_digit(10) { has_digit = true; }
        if "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(char) { has_special = true; }
    }

    if has_uppercase && has_lowercase && has_digit && has_special {
        Ok(())
    } else {
        Err(validator::ValidationError::new("Password too weak"))
    }
}

impl UserRegistration {
    pub fn validate(&self) -> Result<(), validator::ValidationErrors> {
        validator::Validate::validate(self)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_registration() {
        let user = UserRegistration {
            username: "john_doe".to_string(),
            email: "john@example.com".to_string(),
            password: "StrongP@ss123".to_string(),
        };

        assert!(user.validate().is_ok());
    }

    #[test]
    fn test_invalid_username() {
        let user = UserRegistration {
            username: "jo".to_string(), // Too short
            email: "john@example.com".to_string(),
            password: "StrongP@ss123".to_string(),
        };

        assert!(user.validate().is_err());
    }

    #[test]
    fn test_weak_password() {
        let user = UserRegistration {
            username: "john_doe".to_string(),
            email: "john@example.com".to_string(),
            password: "weak".to_string(), // Too weak
        };

        assert!(user.validate().is_err());
    }
}
