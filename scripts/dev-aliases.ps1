# Happy Day 开发别名 (PowerShell版本)

# Docker 别名函数
function hd-up { docker-compose up -d }
function hd-down { docker-compose down }
function hd-build { docker-compose build }
function hd-logs { docker-compose logs -f }
function hd-ps { docker-compose ps }
function hd-restart { docker-compose restart }

# 服务特定别名
function hd-frontend { docker-compose logs -f frontend }
function hd-user { docker-compose logs -f user-service }
function hd-journal { docker-compose logs -f journal-service }
function hd-db { docker-compose logs -f postgres }

# 数据库别名
function hd-psql { docker-compose exec postgres psql -U postgres -d happyday }
function hd-redis { docker-compose exec redis redis-cli }

# 开发工具
function hd-shell-user { docker-compose exec user-service sh }
function hd-shell-journal { docker-compose exec journal-service sh }

Write-Host "Happy Day dev aliases loaded!" -ForegroundColor Green
Write-Host "Use 'hd-' prefix to access various commands" -ForegroundColor Yellow
