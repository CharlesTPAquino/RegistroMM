use std::fmt;
use rocket::http::Status;
use rocket::serde::Serialize;

#[derive(Debug, Serialize)]
pub enum AppErrorType {
    Authentication,
    Validation,
    Database,
    NotFound,
    InternalServer,
}

#[derive(Debug, Serialize)]
pub struct AppError {
    pub message: String,
    pub error_type: AppErrorType,
    pub details: Option<String>,
}

impl AppError {
    pub fn new(message: String, error_type: AppErrorType, details: Option<String>) -> Self {
        Self {
            message,
            error_type,
            details,
        }
    }

    pub fn from_sqlx_error(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => Self::new(
                "Registro não encontrado".to_string(), 
                AppErrorType::NotFound, 
                Some(err.to_string())
            ),
            sqlx::Error::Database(db_err) => Self::new(
                "Erro no banco de dados".to_string(), 
                AppErrorType::Database, 
                Some(db_err.to_string())
            ),
            _ => Self::new(
                "Erro interno do servidor".to_string(), 
                AppErrorType::InternalServer, 
                Some(err.to_string())
            )
        }
    }

    pub fn to_http_status(&self) -> Status {
        match self.error_type {
            AppErrorType::Authentication => Status::Unauthorized,
            AppErrorType::Validation => Status::BadRequest,
            AppErrorType::Database => Status::InternalServerError,
            AppErrorType::NotFound => Status::NotFound,
            AppErrorType::InternalServer => Status::InternalServerError,
        }
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}: {}", 
            match self.error_type {
                AppErrorType::Authentication => "Erro de Autenticação",
                AppErrorType::Validation => "Erro de Validação",
                AppErrorType::Database => "Erro de Banco de Dados",
                AppErrorType::NotFound => "Recurso Não Encontrado",
                AppErrorType::InternalServer => "Erro Interno do Servidor",
            },
            self.message
        )
    }
}

impl From<validator::ValidationErrors> for AppError {
    fn from(errors: validator::ValidationErrors) -> Self {
        Self::new(
            "Erro de validação de dados".to_string(), 
            AppErrorType::Validation, 
            Some(errors.to_string())
        )
    }
}

impl From<argon2::password_hash::Error> for AppError {
    fn from(err: argon2::password_hash::Error) -> Self {
        Self::new(
            "Erro de processamento de senha".to_string(), 
            AppErrorType::Authentication, 
            Some(err.to_string())
        )
    }
}
