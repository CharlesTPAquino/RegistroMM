use chrono::Local;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::sync::Mutex;

#[derive(Debug)]
pub enum LogLevel {
    Info,
    Warn,
    Error,
    Debug,
}

pub struct Logger {
    log_file: Mutex<fs::File>,
}

impl Logger {
    pub fn new(log_path: &str) -> Self {
        let log_file = OpenOptions::new()
            .create(true)
            .write(true)
            .append(true)
            .open(log_path)
            .expect("Não foi possível criar arquivo de log");

        Self {
            log_file: Mutex::new(log_file),
        }
    }

    pub fn log(&self, level: LogLevel, message: &str, context: Option<&str>) {
        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let log_entry = format!(
            "[{}] {:?} - {} {}\n", 
            timestamp, 
            level, 
            message, 
            context.unwrap_or("")
        );

        // Log para arquivo
        if let Ok(mut file) = self.log_file.lock() {
            file.write_all(log_entry.as_bytes()).ok();
        }

        // Log para console
        match level {
            LogLevel::Error => eprintln!("{}", log_entry),
            LogLevel::Warn => println!("{}", log_entry),
            LogLevel::Info => println!("{}", log_entry),
            LogLevel::Debug => println!("{}", log_entry),
        }
    }

    pub fn info(&self, message: &str, context: Option<&str>) {
        self.log(LogLevel::Info, message, context);
    }

    pub fn warn(&self, message: &str, context: Option<&str>) {
        self.log(LogLevel::Warn, message, context);
    }

    pub fn error(&self, message: &str, context: Option<&str>) {
        self.log(LogLevel::Error, message, context);
    }

    pub fn debug(&self, message: &str, context: Option<&str>) {
        self.log(LogLevel::Debug, message, context);
    }
}

// Singleton global para logging
lazy_static! {
    pub static ref GLOBAL_LOGGER: Logger = Logger::new("logs/registro_mm.log");
}

// Macro para logging simplificado
#[macro_export]
macro_rules! log_info {
    ($msg:expr) => {
        $crate::utils::logger::GLOBAL_LOGGER.info($msg, None)
    };
    ($msg:expr, $context:expr) => {
        $crate::utils::logger::GLOBAL_LOGGER.info($msg, Some($context))
    };
}

#[macro_export]
macro_rules! log_error {
    ($msg:expr) => {
        $crate::utils::logger::GLOBAL_LOGGER.error($msg, None)
    };
    ($msg:expr, $context:expr) => {
        $crate::utils::logger::GLOBAL_LOGGER.error($msg, Some($context))
    };
}
