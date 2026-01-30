# Terraform Infrastructure

This directory contains Infrastructure as Code (IaC) for deploying PlanMyTrip on AWS.

## 📁 Structure

```
terraform/
├── main.tf                 # Root module - orchestrates all modules
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── terraform.tfvars.example # Example variable values
└── modules/
    ├── vpc/                # VPC, subnets, NAT gateways, route tables
    ├── alb/                # Application Load Balancer, target groups
    ├── ecs/                # ECS cluster, service, tasks, auto-scaling
    ├── rds/                # PostgreSQL database, Multi-AZ
    └── monitoring/         # CloudWatch alarms
```

## 🚀 Quick Start

### 1. Prerequisites

- AWS CLI configured
- Terraform 1.6.0+
- AWS account with appropriate permissions

### 2. Initialize

```bash
cd terraform
terraform init
```

### 3. Configure Variables

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 4. Plan

```bash
terraform plan
```

### 5. Apply

```bash
terraform apply
```

## 📋 Modules

### VPC Module

Creates network infrastructure:
- VPC with configurable CIDR
- Public subnets (for ALB, NAT gateways)
- Private subnets (for ECS tasks, RDS)
- Internet Gateway
- NAT Gateways (one per AZ)
- Route tables

### ALB Module

Creates load balancing:
- Application Load Balancer
- Target groups
- HTTP listener (redirects to HTTPS)
- HTTPS listener (if certificate provided)
- Security groups

### ECS Module

Creates container orchestration:
- ECS Fargate cluster
- ECR repository
- Task definition
- ECS service
- Auto-scaling policies (CPU & memory)
- CloudWatch log groups
- IAM roles

### RDS Module

Creates database:
- PostgreSQL instance
- Multi-AZ deployment
- Automated backups
- Security groups
- Parameter groups
- Enhanced monitoring

### Monitoring Module

Creates observability:
- CloudWatch alarms for ECS
- CloudWatch alarms for RDS
- CloudWatch alarms for ALB
- SNS topics for alerts

## 🔧 Configuration

### Required Variables

```hcl
db_username           # Database master username
db_password           # Database master password
groq_api_key          # Groq API key
gemini_api_key        # Gemini API key
jwt_secret            # JWT secret for authentication
container_image       # Docker image URL from ECR
```

### Optional Variables

```hcl
aws_region            # Default: us-east-1
environment           # Default: production
vpc_cidr              # Default: 10.0.0.0/16
ecs_desired_count     # Default: 2
ecs_min_capacity      # Default: 2
ecs_max_capacity      # Default: 10
db_instance_class     # Default: db.t3.micro
multi_az              # Default: true
```

## 📊 Outputs

After applying, Terraform outputs:

```
vpc_id                    # VPC ID
alb_dns_name              # Load balancer DNS name
ecs_cluster_name          # ECS cluster name
ecs_service_name          # ECS service name
ecr_repository_url        # ECR repository URL
rds_endpoint              # Database endpoint (sensitive)
cloudwatch_log_group      # Log group name
```

## 🔐 State Management

### S3 Backend

The configuration uses S3 for remote state:

```hcl
backend "s3" {
  bucket         = "planmytrip-terraform-state"
  key            = "production/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "planmytrip-terraform-locks"
}
```

### Create Backend Resources

```bash
# Create S3 bucket
aws s3 mb s3://planmytrip-terraform-state --region us-east-1

# Create DynamoDB table for locking
aws dynamodb create-table \
  --table-name planmytrip-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## 🧪 Testing

### Validate Configuration

```bash
terraform validate
```

### Format Code

```bash
terraform fmt -recursive
```

### Plan Changes

```bash
terraform plan -out=tfplan
```

### Apply Plan

```bash
terraform apply tfplan
```

## 🔄 Updates

### Update Infrastructure

```bash
# Pull latest changes
git pull

# Review changes
terraform plan

# Apply changes
terraform apply
```

### Update Application

```bash
# Update container_image variable
terraform apply -var="container_image=YOUR_ECR_URL/planmytrip:NEW_TAG"
```

## 🗑️ Cleanup

### Destroy Infrastructure

```bash
# Review what will be destroyed
terraform plan -destroy

# Destroy all resources
terraform destroy
```

**Warning**: This will delete all resources including the database. Ensure you have backups!

## 📈 Cost Estimation

Approximate monthly costs (us-east-1):

| Resource | Type | Cost |
|----------|------|------|
| ECS Fargate (2 tasks) | 0.5 vCPU, 1GB RAM | ~$30 |
| RDS PostgreSQL | db.t3.micro, Multi-AZ | ~$30 |
| ALB | Application Load Balancer | ~$20 |
| NAT Gateway (2) | Data transfer | ~$60 |
| CloudWatch Logs | 5GB/month | ~$3 |
| ECR | 10GB storage | ~$1 |
| **Total** | | **~$144/month** |

*Costs may vary based on usage and data transfer*

## 🔒 Security Best Practices

1. **Secrets Management**
   - Use AWS Secrets Manager for sensitive data
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **Network Security**
   - ECS tasks in private subnets
   - RDS in private subnets
   - Security groups with least privilege
   - HTTPS only

3. **IAM Security**
   - Use IAM roles for ECS tasks
   - Principle of least privilege
   - Enable MFA for AWS accounts

4. **Data Security**
   - Enable RDS encryption at rest
   - Enable S3 bucket encryption
   - Regular automated backups

## 📚 Additional Resources

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

## 🆘 Troubleshooting

### State Lock Issues

```bash
# Force unlock (use with caution)
terraform force-unlock LOCK_ID
```

### Resource Already Exists

```bash
# Import existing resource
terraform import module.vpc.aws_vpc.main vpc-xxxxx
```

### Plan Shows Unexpected Changes

```bash
# Refresh state
terraform refresh

# Show current state
terraform show
```

## 📞 Support

For issues or questions:
1. Check CloudWatch Logs
2. Review Terraform plan output
3. Check AWS Console for resource status
4. Open GitHub issue

---

**Built with Terraform for reliable, repeatable infrastructure** 🏗️

