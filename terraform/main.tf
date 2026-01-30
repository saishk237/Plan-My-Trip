terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "planmytrip-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "planmytrip-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "PlanMyTrip"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = data.aws_availability_zones.available.names
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# RDS PostgreSQL Module
module "rds" {
  source = "./modules/rds"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  db_instance_class     = var.db_instance_class
  multi_az              = var.multi_az
  backup_retention_days = var.backup_retention_days
}

# Application Load Balancer Module
module "alb" {
  source = "./modules/alb"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  certificate_arn    = var.certificate_arn
}

# ECS Cluster Module
module "ecs" {
  source = "./modules/ecs"

  project_name           = var.project_name
  environment            = var.environment
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
  alb_target_group_arn   = module.alb.target_group_arn
  alb_security_group_id  = module.alb.security_group_id
  
  # Container configuration
  container_image        = var.container_image
  container_port         = var.container_port
  cpu                    = var.ecs_task_cpu
  memory                 = var.ecs_task_memory
  desired_count          = var.ecs_desired_count
  
  # Auto-scaling configuration
  min_capacity           = var.ecs_min_capacity
  max_capacity           = var.ecs_max_capacity
  cpu_target_value       = var.cpu_target_value
  memory_target_value    = var.memory_target_value
  
  # Environment variables
  database_url           = module.rds.connection_string
  groq_api_key           = var.groq_api_key
  gemini_api_key         = var.gemini_api_key
  jwt_secret             = var.jwt_secret
}

# CloudWatch Alarms Module
module "monitoring" {
  source = "./modules/monitoring"

  project_name        = var.project_name
  environment         = var.environment
  ecs_cluster_name    = module.ecs.cluster_name
  ecs_service_name    = module.ecs.service_name
  alb_arn_suffix      = module.alb.alb_arn_suffix
  target_group_arn_suffix = module.alb.target_group_arn_suffix
  rds_instance_id     = module.rds.instance_id
  sns_topic_arn       = var.sns_topic_arn
}

