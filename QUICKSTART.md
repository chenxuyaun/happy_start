# 🚀 Quick Start Guide

## Starting Essential Services Only

For basic development, you only need the database and cache:

```bash
# Start only PostgreSQL and Redis
docker-compose up -d postgres redis

# Check if they're running
docker-compose ps
```

## Service Access Points

After running the above command, you'll have:

- **PostgreSQL**: `localhost:5432`
  - Username: `postgres`
  - Password: `password`
  - Database: `happyday`

- **Redis**: `localhost:6379`

## Optional Monitoring Services

To start monitoring services as well:

```bash
# Start with monitoring
docker-compose --profile monitoring up -d postgres redis prometheus grafana

# Access monitoring
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3100 (admin/admin)
```

## Development Profiles

The docker-compose.yml uses profiles to organize services:

```bash
# Only database services
docker-compose up -d postgres redis

# With monitoring
docker-compose --profile monitoring up -d

# Full stack (when services are ready)
docker-compose --profile full up -d

# Backend services only
docker-compose --profile backend up -d

# AI services
docker-compose --profile ai up -d
```

## Manual Service Development

Once database is running, you can develop services locally:

```bash
# Frontend (when created)
cd frontend
npm install
npm run dev

# User Service (when created)
cd services/user-service
npm install
npm run start:dev

# Garden Service (when created)
cd services/garden-service
go run cmd/main.go

# AI Service (when created)
cd services/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Automated Setup

Use the PowerShell script for automated setup:

```powershell
# Full automated setup
.\scripts\dev-setup.ps1 -Full

# Database only
.\scripts\dev-setup.ps1 -Database

# Frontend only
.\scripts\dev-setup.ps1 -Frontend
```

## Cleanup

```bash
# Stop all services and remove volumes
docker-compose down -v

# Clean up everything
.\scripts\dev-setup.ps1 -Clean
```

## Next Steps

1. **Start with database**: `docker-compose up -d postgres redis`
2. **Create your first service** in the `services/` directory
3. **Add service to docker-compose.yml** when ready for containerization
4. **Use profiles** to manage different deployment scenarios
