use std::time::{Duration, Instant};
use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::lazy_static;

pub struct PerformanceMonitor {
    metrics: Mutex<HashMap<String, Vec<Duration>>>,
}

impl PerformanceMonitor {
    pub fn new() -> Self {
        Self {
            metrics: Mutex::new(HashMap::new()),
        }
    }

    pub fn measure<F, R>(&self, operation_name: &str, operation: F) -> R 
    where 
        F: FnOnce() -> R 
    {
        let start = Instant::now();
        let result = operation();
        let duration = start.elapsed();

        // Registra métrica
        if let Ok(mut metrics) = self.metrics.lock() {
            metrics
                .entry(operation_name.to_string())
                .or_insert_with(Vec::new)
                .push(duration);
        }

        result
    }

    pub fn get_metrics(&self) -> HashMap<String, PerformanceMetrics> {
        let metrics = self.metrics.lock().unwrap();
        metrics
            .iter()
            .map(|(name, durations)| {
                let total_calls = durations.len();
                let total_time: Duration = durations.iter().sum();
                let avg_time = total_time.checked_div(total_calls as u32).unwrap_or(Duration::ZERO);
                let max_time = durations.iter().max().cloned().unwrap_or(Duration::ZERO);
                let min_time = durations.iter().min().cloned().unwrap_or(Duration::ZERO);

                (
                    name.clone(), 
                    PerformanceMetrics {
                        total_calls,
                        total_time,
                        avg_time,
                        max_time,
                        min_time,
                    }
                )
            })
            .collect()
    }

    pub fn reset(&self) {
        if let Ok(mut metrics) = self.metrics.lock() {
            metrics.clear();
        }
    }
}

#[derive(Debug, Clone)]
pub struct PerformanceMetrics {
    pub total_calls: usize,
    pub total_time: Duration,
    pub avg_time: Duration,
    pub max_time: Duration,
    pub min_time: Duration,
}

lazy_static! {
    pub static ref GLOBAL_PERFORMANCE_MONITOR: PerformanceMonitor = PerformanceMonitor::new();
}

// Macro para medição simplificada
#[macro_export]
macro_rules! measure_performance {
    ($name:expr, $operation:expr) => {
        $crate::utils::performance::GLOBAL_PERFORMANCE_MONITOR.measure($name, || $operation)
    };
}
