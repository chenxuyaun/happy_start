# Happy Day 项目开发环境设置脚本 (PowerShell版本)
# 作者: Happy Day Team
# 日期: 2025-06-27

# 设置错误时停止
$ErrorActionPreference = "Stop"

# 日志函数
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# 检查命令是否存在
function Test-Command {
    param($CommandName)
    $command = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($command) {
        Write-Success "$CommandName 已安装"
        return $true
    } else {
        Write-Error "$CommandName 未安装"
        return $false
    }
}

# 欢迎信息
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🌻 Happy Day 开发环境设置" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 检查系统要求
Write-Info "检查系统要求..."

# 检查 Docker
if (Test-Command "docker") {
    $dockerVersion = docker --version
    Write-Info "Docker 版本: $dockerVersion"
} else {
    Write-Error "请安装 Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
}

# 检查 Docker Compose
if (Test-Command "docker-compose") {
    $composeVersion = docker-compose --version
    Write-Info "Docker Compose 版本: $composeVersion"
} else {
    Write-Error "请安装 Docker Compose"
    exit 1
}

# 检查 Docker 是否运行
try {
    docker info | Out-Null
    Write-Success "Docker 服务正在运行"
} catch {
    Write-Error "Docker 服务未运行，请启动 Docker Desktop"
    exit 1
}

# 检查可选工具
Write-Info "检查可选开发工具..."

if (-not (Test-Command "git")) { Write-Warning "建议安装 Git 进行版本控制" }
if (-not (Test-Command "node")) { Write-Warning "建议安装 Node.js 进行前端开发" }
if (-not (Test-Command "go")) { Write-Warning "建议安装 Go 进行后端开发" }
if (-not (Test-Command "python")) { Write-Warning "建议安装 Python 进行 AI 服务开发" }

# 创建环境变量文件
Write-Info "创建环境配置文件..."

if (-not (Test-Path ".env")) {
    $envContent = @"
# Happy Day 项目环境变量

# 数据库配置
POSTGRES_DB=happyday
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL=postgres://postgres:password@localhost:5432/happyday

# Redis 配置
REDIS_URL=redis://localhost:6379

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# API 配置
API_HOST=localhost
API_PORT=3000
USER_SERVICE_PORT=3001
JOURNAL_SERVICE_PORT=3002
GARDEN_SERVICE_PORT=8082
AI_SERVICE_PORT=8081

# 前端配置
FRONTEND_PORT=3030
REACT_APP_API_URL=http://localhost:3030/api/v1

# 开发模式
NODE_ENV=development
DEBUG=true

# AI 服务配置
MODEL_PATH=./models
INFERENCE_ENDPOINT=http://localhost:8081

# 监控配置
PROMETHEUS_PORT=9090
GRAFANA_PORT=3100
KIBANA_PORT=5601

# 日志级别
LOG_LEVEL=debug
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Success ".env 文件已创建"
} else {
    Write-Warning ".env 文件已存在，跳过创建"
}

# 创建开发用的 docker-compose 覆盖文件
Write-Info "创建开发环境 Docker Compose 配置..."

if (-not (Test-Path "docker-compose.override.yml")) {
    $overrideContent = @"
# 开发环境覆盖配置
version: '3.8'

services:
  # 前端开发配置
  frontend:
    environment:
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # 用户服务开发配置
  user-service:
    environment:
      - NODE_ENV=development
      - DEBUG=*
    volumes:
      - ./services/user-service:/app
      - /app/node_modules

  # 日志服务开发配置
  journal-service:
    environment:
      - NODE_ENV=development
      - DEBUG=*
    volumes:
      - ./services/journal-service:/app
      - /app/node_modules

  # 开发时启用热重载
  postgres:
    environment:
      - POSTGRES_LOG_STATEMENT=all
      - POSTGRES_LOG_MIN_DURATION_STATEMENT=0
"@
    $overrideContent | Out-File -FilePath "docker-compose.override.yml" -Encoding UTF8
    Write-Success "docker-compose.override.yml 已创建"
} else {
    Write-Warning "docker-compose.override.yml 已存在，跳过创建"
}

# 检查并停止现有容器
Write-Info "检查现有 Docker 容器..."

$runningContainers = docker-compose ps | Select-String "Up"
if ($runningContainers) {
    Write-Warning "发现正在运行的容器，将停止它们..."
    docker-compose down
    Write-Success "容器已停止"
}

# 清理旧镜像（可选）
$response = Read-Host "是否要清理旧的 Docker 镜像？(y/N)"
if ($response -match "^[Yy]$") {
    Write-Info "清理未使用的 Docker 镜像..."
    docker image prune -f
    Write-Success "镜像清理完成"
}

# 构建服务
Write-Info "构建 Docker 镜像..."

# 由于我们已经有了构建好的镜像，跳过重复构建
Write-Info "构建应用服务..."
try {
    docker-compose build user-service journal-service frontend
    Write-Success "所有镜像构建完成"
} catch {
    Write-Warning "镜像构建可能已存在，继续..."
}

# 启动基础设施
Write-Info "启动基础设施服务..."
docker-compose up -d postgres redis

# 等待数据库启动
Write-Info "等待数据库启动..."
Start-Sleep -Seconds 10

# 检查数据库连接
Write-Info "检查数据库连接..."
$maxRetries = 30
for ($i = 1; $i -le $maxRetries; $i++) {
    try {
        docker-compose exec -T postgres pg_isready -U postgres | Out-Null
        Write-Success "数据库连接成功"
        break
    } catch {
        if ($i -eq $maxRetries) {
            Write-Error "数据库启动超时"
            exit 1
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
}

# 启动应用服务
Write-Info "启动应用服务..."
docker-compose up -d user-service journal-service frontend

# 等待服务启动
Write-Info "等待服务启动..."
Start-Sleep -Seconds 15

# 健康检查
Write-Info "执行服务健康检查..."

# 检查前端
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3030" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "前端服务 (端口 3030) 运行正常"
    }
} catch {
    Write-Error "前端服务启动失败"
}

# 检查用户服务
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "用户服务 (端口 3001) 运行正常"
    }
} catch {
    Write-Error "用户服务启动失败"
}

# 检查日志服务
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/v1/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "日志服务 (端口 3002) 运行正常"
    }
} catch {
    Write-Error "日志服务启动失败"
}

# 显示服务状态
Write-Info "服务状态："
docker-compose ps

# 创建有用的别名文件
Write-Info "创建开发别名..."

$aliasContent = @"
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

Write-Host "Happy Day 开发别名已加载！" -ForegroundColor Green
Write-Host "使用 'hd-' 前缀访问各种命令" -ForegroundColor Yellow
"@

$aliasContent | Out-File -FilePath "scripts\dev-aliases.ps1" -Encoding UTF8
Write-Success "开发别名已创建在 scripts\dev-aliases.ps1"

# 创建开发指南
Write-Info "创建开发指南..."

$devGuide = @"
# Happy Day 开发指南

## 快速开始

1. 运行开发环境设置：
   ```powershell
   .\scripts\setup-dev-env.ps1
   ```

2. 加载开发别名：
   ```powershell
   . .\scripts\dev-aliases.ps1
   ```

## 可用的服务

- **前端**: http://localhost:3030
- **用户服务**: http://localhost:3001
- **日志服务**: http://localhost:3002
- **数据库**: localhost:5432
- **Redis**: localhost:6379

## 常用命令

### Docker 操作
- `hd-up` - 启动所有服务
- `hd-down` - 停止所有服务
- `hd-build` - 重新构建镜像
- `hd-ps` - 查看服务状态

### 日志查看
- `hd-logs` - 查看所有服务日志
- `hd-frontend` - 查看前端日志
- `hd-user` - 查看用户服务日志
- `hd-journal` - 查看日志服务日志

### 数据库操作
- `hd-psql` - 连接 PostgreSQL
- `hd-redis` - 连接 Redis

## 开发流程

1. 修改代码
2. 服务会自动重启（热重载）
3. 在浏览器中查看更改
4. 查看日志调试问题

## 故障排除

- 如果服务无法启动，检查端口是否被占用
- 使用 `hd-logs` 查看详细错误信息
- 使用 `hd-restart <service>` 重启特定服务

## Windows 特别说明

- 使用 PowerShell 运行脚本
- 别名文件: `.\scripts\dev-aliases.ps1`
- 加载别名: `. .\scripts\dev-aliases.ps1`
"@

$devGuide | Out-File -FilePath "DEVELOPMENT.md" -Encoding UTF8
Write-Success "开发指南已创建: DEVELOPMENT.md"

# 最终总结
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Success "🎉 开发环境设置完成！"
Write-Host "==================================" -ForegroundColor Cyan

Write-Host ""
Write-Info "服务访问地址："
Write-Host "  🌐 前端:      http://localhost:3030" -ForegroundColor White
Write-Host "  👤 用户服务:  http://localhost:3001" -ForegroundColor White
Write-Host "  📝 日志服务:  http://localhost:3002" -ForegroundColor White
Write-Host "  🗄️  数据库:    localhost:5432" -ForegroundColor White
Write-Host "  🔄 Redis:     localhost:6379" -ForegroundColor White

Write-Host ""
Write-Info "下一步操作："
Write-Host "  1. 加载开发别名: . .\scripts\dev-aliases.ps1" -ForegroundColor White
Write-Host "  2. 查看服务状态: hd-ps" -ForegroundColor White
Write-Host "  3. 查看日志:     hd-logs" -ForegroundColor White
Write-Host "  4. 阅读开发指南: Get-Content DEVELOPMENT.md" -ForegroundColor White

Write-Host ""
Write-Success "Happy Day 开发环境已就绪！开始愉快地编码吧！🚀"
