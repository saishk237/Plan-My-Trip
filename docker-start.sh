#!/bin/bash

# PlanMyTrip Docker Quick Start Script
# This script helps you quickly set up and run PlanMyTrip with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Print banner
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   PlanMyTrip Docker Quick Start       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if Docker is installed
print_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo ""
    echo "Please install Docker first:"
    echo "  Ubuntu/Debian: https://docs.docker.com/engine/install/ubuntu/"
    echo "  macOS: https://docs.docker.com/desktop/install/mac-install/"
    echo "  Windows: https://docs.docker.com/desktop/install/windows-install/"
    exit 1
fi
print_success "Docker is installed: $(docker --version)"

# Check if Docker Compose is installed
print_info "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo ""
    echo "Please install Docker Compose:"
    echo "  https://docs.docker.com/compose/install/"
    exit 1
fi
print_success "Docker Compose is installed: $(docker-compose --version)"

# Check if .env file exists
print_info "Checking environment configuration..."
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    
    if [ -f env.docker.example ]; then
        cp env.docker.example .env
        print_success ".env file created from template"
        
        # Prompt for API keys
        echo ""
        print_warning "⚠ IMPORTANT: You need to configure your API keys in .env file"
        echo ""
        read -p "Do you want to configure API keys now? (y/n): " configure_now
        
        if [[ $configure_now =~ ^[Yy]$ ]]; then
            echo ""
            read -p "Enter your Groq API Key: " groq_key
            read -p "Enter your JWT Secret (min 32 chars): " jwt_secret
            read -p "Enter PostgreSQL password (default: postgres123): " postgres_pass
            
            # Set default if empty
            postgres_pass=${postgres_pass:-postgres123}
            
            # Update .env file
            sed -i.bak "s/your-groq-api-key-here/$groq_key/" .env
            sed -i.bak "s/your-super-secret-jwt-key-minimum-32-characters-long/$jwt_secret/" .env
            sed -i.bak "s/your-secure-postgres-password/$postgres_pass/" .env
            rm .env.bak 2>/dev/null || true
            
            print_success "API keys configured!"
        else
            echo ""
            print_warning "Please edit .env file manually before starting:"
            echo "  nano .env"
            echo ""
            read -p "Press Enter when ready to continue..."
        fi
    else
        print_error "env.docker.example not found!"
        exit 1
    fi
else
    print_success ".env file exists"
fi

# Ask which environment to run
echo ""
echo "Which environment do you want to run?"
echo "  1) Production (recommended)"
echo "  2) Development (with hot reload)"
echo ""
read -p "Enter choice (1 or 2): " env_choice

case $env_choice in
    1)
        COMPOSE_FILE="docker-compose.yml"
        ENV_TYPE="Production"
        ;;
    2)
        COMPOSE_FILE="docker-compose.dev.yml"
        ENV_TYPE="Development"
        ;;
    *)
        print_error "Invalid choice. Using Production."
        COMPOSE_FILE="docker-compose.yml"
        ENV_TYPE="Production"
        ;;
esac

echo ""
print_info "Starting PlanMyTrip in $ENV_TYPE mode..."
echo ""

# Build and start containers
print_info "Building Docker images (this may take a few minutes)..."
docker-compose -f $COMPOSE_FILE build

print_info "Starting containers..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
print_info "Waiting for services to be ready..."
sleep 5

# Check if containers are running
if docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
    echo ""
    print_success "✓ PlanMyTrip is running!"
    echo ""
    echo "╔═══════════════════════════════════════╗"
    echo "║         Access Information            ║"
    echo "╚═══════════════════════════════════════╝"
    echo ""
    echo "  🌐 Application: http://localhost:5000"
    
    if [ "$ENV_TYPE" == "Development" ]; then
        echo "  🔧 Vite Dev Server: http://localhost:5173"
    fi
    
    echo "  🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "╔═══════════════════════════════════════╗"
    echo "║         Useful Commands               ║"
    echo "╚═══════════════════════════════════════╝"
    echo ""
    echo "  View logs:"
    echo "    docker-compose -f $COMPOSE_FILE logs -f"
    echo ""
    echo "  Stop services:"
    echo "    docker-compose -f $COMPOSE_FILE down"
    echo ""
    echo "  Restart services:"
    echo "    docker-compose -f $COMPOSE_FILE restart"
    echo ""
    echo "  View status:"
    echo "    docker-compose -f $COMPOSE_FILE ps"
    echo ""
    echo "  Access database:"
    echo "    docker-compose -f $COMPOSE_FILE exec postgres psql -U postgres -d planmytrip"
    echo ""
    
    # Ask if user wants to view logs
    echo ""
    read -p "Do you want to view logs now? (y/n): " view_logs
    
    if [[ $view_logs =~ ^[Yy]$ ]]; then
        echo ""
        print_info "Showing logs (Press Ctrl+C to exit)..."
        echo ""
        docker-compose -f $COMPOSE_FILE logs -f
    fi
else
    echo ""
    print_error "Failed to start containers!"
    echo ""
    print_info "Checking logs..."
    docker-compose -f $COMPOSE_FILE logs
    exit 1
fi





