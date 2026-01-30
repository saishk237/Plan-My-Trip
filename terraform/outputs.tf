output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.alb.dns_name
}

output "alb_zone_id" {
  description = "Application Load Balancer zone ID"
  value       = module.alb.zone_id
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "rds_connection_string" {
  description = "RDS connection string"
  value       = module.rds.connection_string
  sensitive   = true
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecs.ecr_repository_url
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = module.ecs.log_group_name
}

