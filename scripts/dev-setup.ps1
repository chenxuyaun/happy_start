# 企业级心理治愈项目开发环境设置脚本
# PowerShell版本

param(
    [switch]$Full = $false,
    [switch]$Frontend = $false,
    [switch]$Backend = $false,
    [switch]$Database = $false,
    [switch]$AI = $false,
    [switch]$Clean = $false
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ErrorActionPreference = "Stop"

Write-Host "🌸 Happy Day 企业级心理治愈项目开发环境设置" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

function Install-Prerequisites {
    Write-Host "🔍 检查必需的软件..." -ForegroundColor Yellow
    
    $requirements = @{
        "node" = "Node.js 18+"
        "npm" = "NPM"
        "docker" = "Docker"
        "docker-compose" = "Docker Compose"
        "git" = "Git"
        "go" = "Go 1.21+"
        "python" = "Python 3.11+"
        "kubectl" = "Kubernetes CLI (可选)"
    }
    
    $missing = @()
    
    foreach ($cmd in $requirements.Keys) {
        if (Test-Command $cmd) {
            Write-Host "✅ $($requirements[$cmd]) 已安装" -ForegroundColor Green
        } else {
            Write-Host "❌ $($requirements[$cmd]) 未找到" -ForegroundColor Red
            $missing += $requirements[$cmd]
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "`n缺少以下软件，请先安装：" -ForegroundColor Red
        $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        Write-Host "`n建议使用 Chocolatey 或 Scoop 来安装这些工具" -ForegroundColor Yellow
        exit 1
    }
}

function Setup-Environment {
    Write-Host "`n🔧 设置环境变量..." -ForegroundColor Yellow
    
    # 创建 .env 文件（如果不存在）
    $envFile = "$ProjectRoot\.env"
    if (-not (Test-Path $envFile)) {
        @"
# 开发环境配置
NODE_ENV=development
PORT=3000

# 数据库配置
DATABASE_URL=postgres://postgres:password@localhost:5432/happyday
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI服务配置
AI_SERVICE_URL=http://localhost:8081
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# 第三方服务
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 监控配置
PROMETHEUS_ENDPOINT=http://localhost:9090
GRAFANA_URL=http://localhost:3001

# 文件存储
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10MB

# 安全配置
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 开发工具
DEBUG=happy-day:*
LOG_LEVEL=debug
"@ | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "✅ 创建了 .env 配置文件" -ForegroundColor Green
    }
}

function Setup-Database {
    Write-Host "`n🗄️ 设置数据库..." -ForegroundColor Yellow
    
    try {
        # 检查 Docker 是否运行
        docker info | Out-Null
        
        # 启动数据库服务
        Push-Location $ProjectRoot
        docker-compose up -d postgres redis
        
        Write-Host "⏳ 等待数据库启动..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
        
        # 运行数据库初始化脚本
        $initScript = "$ProjectRoot\database\init.sql"
        if (Test-Path $initScript) {
            docker-compose exec -T postgres psql -U postgres -f /docker-entrypoint-initdb.d/init.sql
            Write-Host "✅ 数据库初始化完成" -ForegroundColor Green
        }
        
        Pop-Location
    } catch {
        Write-Host "❌ 数据库设置失败: $($_.Exception.Message)" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

function Setup-Frontend {
    Write-Host "`n🎨 设置前端项目..." -ForegroundColor Yellow
    
    $frontendPaths = @(
        "$ProjectRoot\frontend",
        "$ProjectRoot\apps\web",
        "$ProjectRoot\apps\mobile",
        "$ProjectRoot\apps\vr"
    )
    
    foreach ($path in $frontendPaths) {
        if (Test-Path "$path\package.json") {
            Write-Host "📦 安装 $path 依赖..." -ForegroundColor Cyan
            Push-Location $path
            try {
                npm install
                Write-Host "✅ $path 依赖安装完成" -ForegroundColor Green
            } catch {
                Write-Host "❌ $path 依赖安装失败" -ForegroundColor Red
            }
            Pop-Location
        }
    }
}

function Setup-Backend {
    Write-Host "`n🔧 设置后端服务..." -ForegroundColor Yellow
    
    # Node.js 服务
    $nodeServices = @(
        "$ProjectRoot\services\user-service",
        "$ProjectRoot\services\journal-service",
        "$ProjectRoot\services\notification-service",
        "$ProjectRoot\services\api-gateway"
    )
    
    foreach ($service in $nodeServices) {
        if (Test-Path "$service\package.json") {
            Write-Host "📦 安装 $service 依赖..." -ForegroundColor Cyan
            Push-Location $service
            try {
                npm install
                Write-Host "✅ $service 依赖安装完成" -ForegroundColor Green
            } catch {
                Write-Host "❌ $service 依赖安装失败" -ForegroundColor Red
            }
            Pop-Location
        }
    }
    
    # Go 服务
    $goService = "$ProjectRoot\services\garden-service"
    if (Test-Path "$goService\go.mod") {
        Write-Host "📦 安装 Go 服务依赖..." -ForegroundColor Cyan
        Push-Location $goService
        try {
            go mod download
            go mod tidy
            Write-Host "✅ Go 服务依赖安装完成" -ForegroundColor Green
        } catch {
            Write-Host "❌ Go 服务依赖安装失败" -ForegroundColor Red
        }
        Pop-Location
    }
}

function Setup-AI {
    Write-Host "`n🤖 设置AI服务..." -ForegroundColor Yellow
    
    $aiService = "$ProjectRoot\services\ai-service"
    if (Test-Path "$aiService\requirements.txt") {
        Push-Location $aiService
        try {
            # 创建虚拟环境（如果不存在）
            if (-not (Test-Path "venv")) {
                python -m venv venv
                Write-Host "✅ 创建Python虚拟环境" -ForegroundColor Green
            }
            
            # 激活虚拟环境并安装依赖
            & ".\venv\Scripts\Activate.ps1"
            pip install --upgrade pip
            pip install -r requirements.txt
            
            # 下载预训练模型
            python -c "import spacy; spacy.cli.download('en_core_web_sm')"
            
            Write-Host "✅ AI服务依赖安装完成" -ForegroundColor Green
        } catch {
            Write-Host "❌ AI服务设置失败: $($_.Exception.Message)" -ForegroundColor Red
        }
        Pop-Location
    }
}

function Start-Development {
    Write-Host "`n🚀 启动开发环境..." -ForegroundColor Yellow
    
    Push-Location $ProjectRoot
    
    # 启动基础设施服务
    docker-compose up -d postgres redis elasticsearch prometheus grafana
    
    Write-Host "⏳ 等待服务启动..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # 显示服务状态
    Write-Host "`n📊 服务状态:" -ForegroundColor Green
    Write-Host "  数据库 (PostgreSQL): http://localhost:5432" -ForegroundColor Cyan
    Write-Host "  缓存 (Redis): http://localhost:6379" -ForegroundColor Cyan
    Write-Host "  搜索 (Elasticsearch): http://localhost:9200" -ForegroundColor Cyan
    Write-Host "  监控 (Prometheus): http://localhost:9090" -ForegroundColor Cyan
    Write-Host "  仪表板 (Grafana): http://localhost:3001 (admin/admin)" -ForegroundColor Cyan
    
    Write-Host "`n🎯 接下来可以启动应用服务:" -ForegroundColor Yellow
    Write-Host "  前端: npm run dev (在 frontend 目录)" -ForegroundColor Cyan
    Write-Host "  用户服务: npm run start:dev (在 services/user-service 目录)" -ForegroundColor Cyan
    Write-Host "  花园服务: go run cmd/main.go (在 services/garden-service 目录)" -ForegroundColor Cyan
    Write-Host "  AI服务: uvicorn app.main:app --reload (在 services/ai-service 目录)" -ForegroundColor Cyan
    
    Pop-Location
}

function Clean-Environment {
    Write-Host "`n🧹 清理开发环境..." -ForegroundColor Yellow
    
    Push-Location $ProjectRoot
    
    # 停止所有容器
    docker-compose down -v
    
    # 清理Docker镜像和卷
    docker system prune -f
    docker volume prune -f
    
    Write-Host "✅ 环境清理完成" -ForegroundColor Green
    
    Pop-Location
}

# 主执行逻辑
try {
    if ($Clean) {
        Clean-Environment
        exit 0
    }
    
    Install-Prerequisites
    Setup-Environment
    
    if ($Full -or (-not ($Frontend -or $Backend -or $Database -or $AI))) {
        Setup-Database
        Setup-Frontend
        Setup-Backend
        Setup-AI
        Start-Development
    } else {
        if ($Database) { Setup-Database }
        if ($Frontend) { Setup-Frontend }
        if ($Backend) { Setup-Backend }
        if ($AI) { Setup-AI }
    }
    
    Write-Host "`n🎉 开发环境设置完成！" -ForegroundColor Green
    Write-Host "访问 http://localhost:3000 开始开发" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ 设置失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
