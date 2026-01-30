# CloudWatch Alarms for ECS Service

# High CPU Utilization
resource "aws_cloudwatch_metric_alarm" "ecs_cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-ecs-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "ECS CPU utilization is too high"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.ecs_service_name
  }
}

# High Memory Utilization
resource "aws_cloudwatch_metric_alarm" "ecs_memory_high" {
  alarm_name          = "${var.project_name}-${var.environment}-ecs-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "ECS memory utilization is too high"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.ecs_service_name
  }
}

# ALB Target Response Time
resource "aws_cloudwatch_metric_alarm" "alb_response_time" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-response-time-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Average"
  threshold           = "0.5"
  alarm_description   = "ALB target response time is too high (>500ms)"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }
}

# ALB Unhealthy Target Count
resource "aws_cloudwatch_metric_alarm" "alb_unhealthy_targets" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-unhealthy-targets"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Average"
  threshold           = "0"
  alarm_description   = "ALB has unhealthy targets"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TargetGroup  = var.target_group_arn_suffix
    LoadBalancer = var.alb_arn_suffix
  }
}

# ALB 5XX Errors
resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "ALB is receiving too many 5XX errors"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }
}

# RDS CPU Utilization
resource "aws_cloudwatch_metric_alarm" "rds_cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "RDS CPU utilization is too high"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# RDS Free Storage Space
resource "aws_cloudwatch_metric_alarm" "rds_storage_low" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "5000000000" # 5GB in bytes
  alarm_description   = "RDS free storage space is low"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# RDS Database Connections
resource "aws_cloudwatch_metric_alarm" "rds_connections_high" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "RDS database connections are too high"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

