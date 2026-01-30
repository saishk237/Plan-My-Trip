output "ecs_cpu_alarm_arn" {
  description = "ECS CPU alarm ARN"
  value       = aws_cloudwatch_metric_alarm.ecs_cpu_high.arn
}

output "ecs_memory_alarm_arn" {
  description = "ECS memory alarm ARN"
  value       = aws_cloudwatch_metric_alarm.ecs_memory_high.arn
}

output "alb_response_time_alarm_arn" {
  description = "ALB response time alarm ARN"
  value       = aws_cloudwatch_metric_alarm.alb_response_time.arn
}

output "rds_cpu_alarm_arn" {
  description = "RDS CPU alarm ARN"
  value       = aws_cloudwatch_metric_alarm.rds_cpu_high.arn
}

