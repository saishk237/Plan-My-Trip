variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "alb_target_group_arn" {
  description = "ALB target group ARN"
  type        = string
}

variable "alb_security_group_id" {
  description = "ALB security group ID"
  type        = string
}

variable "container_image" {
  description = "Docker image for ECS task"
  type        = string
}

variable "container_port" {
  description = "Container port"
  type        = number
}

variable "cpu" {
  description = "ECS task CPU units"
  type        = string
}

variable "memory" {
  description = "ECS task memory in MB"
  type        = string
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
}

variable "min_capacity" {
  description = "Minimum number of ECS tasks"
  type        = number
}

variable "max_capacity" {
  description = "Maximum number of ECS tasks"
  type        = number
}

variable "cpu_target_value" {
  description = "Target CPU utilization for auto-scaling"
  type        = number
}

variable "memory_target_value" {
  description = "Target memory utilization for auto-scaling"
  type        = number
}

variable "database_url" {
  description = "Database connection string"
  type        = string
  sensitive   = true
}

variable "groq_api_key" {
  description = "Groq API key (ARN for Secrets Manager)"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Gemini API key (ARN for Secrets Manager)"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret (ARN for Secrets Manager)"
  type        = string
  sensitive   = true
}

