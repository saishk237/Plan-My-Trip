output "instance_id" {
  description = "RDS instance ID"
  value       = aws_db_instance.main.id
}

output "endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
}

output "connection_string" {
  description = "Database connection string"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}"
  sensitive   = true
}

output "security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}

