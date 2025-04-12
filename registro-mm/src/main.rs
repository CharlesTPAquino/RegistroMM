#[macro_use] extern crate rocket;

use rocket::fairing::AdHoc;
use rocket::Config;
use std::env;

mod routes;
mod models;
mod services;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    dotenv::dotenv().ok();

    let config = Config::figment()
        .merge(("port", 8000))
        .merge(("address", "127.0.0.1"));

    rocket::custom(config)
        .mount("/", routes![
            routes::health::health_check,
            routes::auth::login,
            routes::auth::register
        ])
        .attach(AdHoc::config::<DatabaseConfig>())
        .launch()
        .await?;

    Ok(())
}

#[derive(Debug)]
struct DatabaseConfig {
    url: String,
}

impl DatabaseConfig {
    fn from_env() -> Self {
        Self {
            url: env::var("DATABASE_URL")
                .expect("DATABASE_URL must be set"),
        }
    }
}
