# Monitoring Stack

Comprehensive monitoring and observability setup for PlanMyTrip using Prometheus, Grafana, and AlertManager.

## 📊 Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and notifications
- **Node Exporter**: System metrics
- **cAdvisor**: Container metrics
- **CloudWatch Exporter**: AWS metrics (ECS, RDS, ALB)

## 🚀 Quick Start

### Start Monitoring Stack

```bash
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### Access Dashboards

- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin`
  
- **Prometheus**: http://localhost:9090

- **AlertManager**: http://localhost:9093

### Stop Monitoring Stack

```bash
docker-compose -f docker-compose.monitoring.yml down
```

## 📁 Structure

```
monitoring/
├── docker-compose.monitoring.yml   # Docker Compose configuration
├── prometheus/
│   ├── prometheus.yml              # Prometheus configuration
│   └── alerts/
│       ├── application-alerts.yml  # Application alert rules
│       └── infrastructure-alerts.yml # Infrastructure alert rules
├── grafana/
│   ├── dashboards/
│   │   ├── application-dashboard.json
│   │   └── infrastructure-dashboard.json
│   └── provisioning/
│       ├── datasources/
│       │   └── prometheus.yml      # Prometheus datasource
│       └── dashboards/
│           └── dashboards.yml      # Dashboard provisioning
└── alertmanager/
    └── alertmanager.yml            # AlertManager configuration
```

## 📈 Metrics Collected

### Application Metrics

- **Request Metrics**
  - `http_requests_total`: Total HTTP requests
  - `http_request_duration_seconds`: Request duration histogram
  - `http_requests_in_flight`: Current active requests

- **Error Metrics**
  - `http_requests_total{status=~"5.."}`: Server errors
  - `http_requests_total{status=~"4.."}`: Client errors

- **Node.js Metrics**
  - `nodejs_heap_size_used_bytes`: Heap memory usage
  - `nodejs_heap_size_total_bytes`: Total heap size
  - `process_cpu_seconds_total`: CPU usage

### Infrastructure Metrics

- **ECS Metrics** (via CloudWatch Exporter)
  - `aws_ecs_service_cpuutilization_average`: CPU utilization
  - `aws_ecs_service_memoryutilization_average`: Memory utilization
  - `aws_ecs_service_running_count`: Running task count

- **RDS Metrics**
  - `aws_rds_cpuutilization_average`: Database CPU
  - `aws_rds_database_connections_average`: Active connections
  - `aws_rds_free_storage_space_average`: Free storage

- **ALB Metrics**
  - `aws_alb_request_count_sum`: Request count
  - `aws_alb_target_response_time_average`: Response time
  - `aws_alb_healthy_host_count_average`: Healthy targets

- **System Metrics** (via Node Exporter)
  - `node_cpu_seconds_total`: CPU usage
  - `node_memory_MemAvailable_bytes`: Available memory
  - `node_disk_io_time_seconds_total`: Disk I/O

## 🚨 Alerts

### Application Alerts

| Alert | Threshold | Severity |
|-------|-----------|----------|
| High Response Time | >500ms for 5min | Warning |
| High Error Rate | >5% for 5min | Critical |
| Application Down | Down for 2min | Critical |
| High Memory Usage | >85% for 5min | Warning |
| High CPU Usage | >80% for 5min | Warning |

### Infrastructure Alerts

| Alert | Threshold | Severity |
|-------|-----------|----------|
| ECS Service Unhealthy | Running < Desired | Critical |
| RDS High CPU | >80% for 10min | Warning |
| RDS Connection Failure | Connection down | Critical |
| ALB High Latency | >500ms for 5min | Warning |
| High Disk Usage | >85% used | Warning |

## 📊 Dashboards

### Application Dashboard

Monitors application health and performance:
- Request rate over time
- Response time (95th percentile)
- Error rate by status code
- Active connections
- Memory usage (heap)
- CPU usage

### Infrastructure Dashboard

Monitors AWS infrastructure:
- ECS running tasks
- ECS CPU/Memory utilization
- ALB request count
- ALB target response time
- ALB healthy/unhealthy targets
- RDS CPU utilization
- RDS database connections
- RDS free storage space

## 🔔 Alert Configuration

### Slack Integration

Edit `alertmanager/alertmanager.yml`:

```yaml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'

receivers:
  - name: 'critical-alerts'
    slack_configs:
      - channel: '#planmytrip-critical'
        title: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
```

### Email Integration

Add to `alertmanager/alertmanager.yml`:

```yaml
receivers:
  - name: 'critical-alerts'
    email_configs:
      - to: 'ops-team@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alertmanager@example.com'
        auth_password: 'app-password'
```

## 🔍 Querying Metrics

### Prometheus Query Examples

**Request rate**:
```promql
rate(http_requests_total[5m])
```

**95th percentile response time**:
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Error rate**:
```promql
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```

**ECS CPU utilization**:
```promql
aws_ecs_service_cpuutilization_average
```

**Available memory**:
```promql
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024
```

## 🔧 Configuration

### Add New Scrape Target

Edit `prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'my-service'
    static_configs:
      - targets: ['my-service:9090']
```

### Add New Alert Rule

Create file in `prometheus/alerts/`:

```yaml
groups:
  - name: my_alerts
    interval: 30s
    rules:
      - alert: MyAlert
        expr: my_metric > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "My alert fired"
          description: "Metric is {{ $value }}"
```

### Add New Dashboard

1. Create dashboard in Grafana UI
2. Export JSON
3. Save to `grafana/dashboards/`
4. Restart Grafana container

## 📊 Retention

- **Prometheus**: 30 days (configurable in `prometheus.yml`)
- **Grafana**: Persistent (stored in Docker volume)
- **AlertManager**: 120 hours

## 🔐 Security

### Change Default Passwords

Edit `docker-compose.monitoring.yml`:

```yaml
grafana:
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=your-secure-password
```

### Enable Authentication

For Prometheus, add to `prometheus.yml`:

```yaml
basic_auth_users:
  admin: $2y$10$hashed-password
```

## 🧪 Testing Alerts

### Trigger Test Alert

```bash
# High CPU alert
stress --cpu 8 --timeout 300s

# High memory alert
stress --vm 1 --vm-bytes 1G --timeout 300s

# Application error alert
curl -X POST http://localhost:5000/api/test-error
```

### Verify Alert in AlertManager

```bash
curl http://localhost:9093/api/v2/alerts
```

## 📈 Performance Tuning

### Prometheus

```yaml
# Reduce scrape interval for less data
global:
  scrape_interval: 30s  # Default: 15s

# Reduce retention
command:
  - '--storage.tsdb.retention.time=15d'  # Default: 30d
```

### Grafana

```yaml
# Limit query range
environment:
  - GF_DATAPROXY_TIMEOUT=30
  - GF_DATAPROXY_MAX_IDLE_CONNECTIONS=100
```

## 🔄 Backup & Restore

### Backup Grafana Dashboards

```bash
# Export all dashboards
docker exec planmytrip-grafana grafana-cli admin export-dashboard

# Backup Grafana data
docker cp planmytrip-grafana:/var/lib/grafana ./grafana-backup
```

### Restore Grafana

```bash
# Restore data
docker cp ./grafana-backup planmytrip-grafana:/var/lib/grafana

# Restart Grafana
docker restart planmytrip-grafana
```

## 🆘 Troubleshooting

### Prometheus Not Scraping Targets

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check Prometheus logs
docker logs planmytrip-prometheus
```

### Grafana Dashboard Not Loading

```bash
# Check Grafana logs
docker logs planmytrip-grafana

# Verify datasource
curl http://localhost:3001/api/datasources
```

### Alerts Not Firing

```bash
# Check alert rules
curl http://localhost:9090/api/v1/rules

# Check AlertManager
curl http://localhost:9093/api/v2/alerts
```

## 📚 Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [AlertManager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)

## 🎯 Best Practices

1. **Use Labels**: Tag metrics with environment, service, version
2. **Set Retention**: Balance storage cost vs data retention needs
3. **Alert Fatigue**: Set appropriate thresholds to avoid noise
4. **Dashboard Organization**: Group related metrics together
5. **Regular Review**: Update dashboards and alerts as system evolves

---

**Monitor everything, alert on what matters** 📊

