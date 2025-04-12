use reqwest::Client;
use serde_json::json;
use std::env;
use std::time::Duration;

pub struct ExternalMonitoring {
    client: Client,
    monitoring_url: String,
}

impl ExternalMonitoring {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let monitoring_url = env::var("EXTERNAL_MONITORING_URL")
            .unwrap_or_else(|_| "https://api.uptimerobot.com/v2/newMonitor".to_string());

        Ok(Self {
            client: Client::new(),
            monitoring_url,
        })
    }

    pub async fn register_monitor(&self, service_name: &str, service_url: &str) -> Result<(), reqwest::Error> {
        let payload = json!({
            "api_key": env::var("UPTIME_ROBOT_API_KEY").expect("Uptime Robot API Key not set"),
            "format": "json",
            "type": 1, // HTTP(s)
            "url": service_url,
            "friendly_name": service_name
        });

        let response = self.client
            .post(&self.monitoring_url)
            .json(&payload)
            .send()
            .await?;

        if response.status().is_success() {
            println!("Monitor registrado com sucesso para {}", service_name);
        } else {
            eprintln!("Falha ao registrar monitor para {}", service_name);
        }

        Ok(())
    }

    pub async fn send_performance_metrics(&self, metrics: &str) -> Result<(), reqwest::Error> {
        let payload = json!({
            "metrics": metrics,
            "service": "registro-mm"
        });

        let response = self.client
            .post("https://metrics-collector.example.com/collect")
            .json(&payload)
            .send()
            .await?;

        Ok(())
    }

    pub async fn health_check(&self, service_url: &str) -> Result<bool, reqwest::Error> {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .build()?;

        let response = client.get(service_url).send().await?;
        Ok(response.status().is_success())
    }
}

// Exemplo de uso em serviço
pub async fn setup_external_monitoring() -> Result<(), Box<dyn std::error::Error>> {
    let monitoring = ExternalMonitoring::new()?;
    
    monitoring.register_monitor(
        "Registro MM API", 
        "https://seu-dominio.com/health"
    ).await?;

    Ok(())
}
