#!/bin/bash

# Happy Day 项目开发环境设置脚本
# 作者: Happy Day Team
# 日期: 2025-06-27

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if command -v $1 &> /dev/null; then
        log_success "$1 已安装"
        return 0
    else
        log_error "$1 未安装"
        return 1
    fi
}

# 欢迎信息
echo "=================================="
echo "🌻 Happy Day 开发环境设置"
echo "=================================="

# 检查系统要求
log_info "检查系统要求..."

# 检查 Docker
if check_command docker; then
    DOCKER_VERSION=$(docker --version)
    log_info "Docker 版本: $DOCKER_VERSION"
else
    log_error "请安装 Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 检查 Docker Compose
if check_command docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version)
    log_info "Docker Compose 版本: $COMPOSE_VERSION"
else
    log_error "请安装 Docker Compose"
    exit 1
fi

# 检查 Docker 是否运行
if docker info &> /dev/null; then
    log_success "Docker 服务正在运行"
else
    log_error "Docker 服务未运行，请启动 Docker Desktop"
    exit 1
fi

# 检查可选工具
log_info "检查可选开发工具..."

check_command git || log_warning "建议安装 Git 进行版本控制"
check_command node || log_warning "建议安装 Node.js 进行前端开发"
check_command go || log_warning "建议安装 Go 进行后端开发"
check_command python || log_warning "建议安装 Python 进行 AI 服务开发"

# 创建环境变量文件
log_info "创建环境配置文件..."

# 创建 .env 文件
if [ ! -f .env ]; then
    cat > .env << EOF
# Happy Day 项目环境变量

# 数据库配置
POSTGRES_DB=happyday
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL=postgres://postgres:password@localhost:5432/happyday

# Redis 配置
REDIS_URL=redis://localhost:6379

# JWT 配置
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "your-super-secret-jwt-key-change-in-production")
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
EOF
    log_success ".env 文件已创建"
else
    log_warning ".env 文件已存在，跳过创建"
fi

# 创建开发用的 docker-compose 覆盖文件
log_info "创建开发环境 Docker Compose 配置..."

if [ ! -f docker-compose.override.yml ]; then
    cat > docker-compose.override.yml << EOF
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
EOF
    log_success "docker-compose.override.yml 已创建"
else
    log_warning "docker-compose.override.yml 已存在，跳过创建"
fi

# 检查并停止现有容器
log_info "检查现有 Docker 容器..."

if docker-compose ps | grep -q "Up"; then
    log_warning "发现正在运行的容器，将停止它们..."
    docker-compose down
    log_success "容器已停止"
fi

# 清理旧镜像（可选）
read -p "是否要清理旧的 Docker 镜像？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "清理未使用的 Docker 镜像..."
    docker image prune -f
    log_success "镜像清理完成"
fi

# 构建服务
log_info "构建 Docker 镜像..."

# 构建基础服务
docker-compose build --no-cache postgres redis

# 构建应用服务
log_info "构建应用服务..."
docker-compose build user-service journal-service frontend

log_success "所有镜像构建完成"

# 启动基础设施
log_info "启动基础设施服务..."
docker-compose up -d postgres redis

# 等待数据库启动
log_info "等待数据库启动..."
sleep 10

# 检查数据库连接
log_info "检查数据库连接..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        log_success "数据库连接成功"
        break
    else
        if [ $i -eq 30 ]; then
            log_error "数据库启动超时"
            exit 1
        fi
        echo -n "."
        sleep 2
    fi
done

# 启动应用服务
log_info "启动应用服务..."
docker-compose up -d user-service journal-service frontend

# 等待服务启动
log_info "等待服务启动..."
sleep 15

# 健康检查
log_info "执行服务健康检查..."

# 检查前端
if curl -f http://localhost:3030 &> /dev/null; then
    log_success "前端服务 (端口 3030) 运行正常"
else
    log_error "前端服务启动失败"
fi

# 检查用户服务
if curl -f http://localhost:3001/api/v1/health &> /dev/null; then
    log_success "用户服务 (端口 3001) 运行正常"
else
    log_error "用户服务启动失败"
fi

# 检查日志服务
if curl -f http://localhost:3002/api/v1/health &> /dev/null; then
    log_success "日志服务 (端口 3002) 运行正常"
else
    log_error "日志服务启动失败"
fi

# 显示服务状态
log_info "服务状态："
docker-compose ps

# 创建有用的别名文件
log_info "创建开发别名..."

cat > scripts/dev-aliases.sh << 'EOF'
#!/bin/bash
# Happy Day 开发别名

# Docker 别名
alias hd-up='docker-compose up -d'
alias hd-down='docker-compose down'
alias hd-build='docker-compose build'
alias hd-logs='docker-compose logs -f'
alias hd-ps='docker-compose ps'
alias hd-restart='docker-compose restart'

# 服务特定别名
alias hd-frontend='docker-compose logs -f frontend'
alias hd-user='docker-compose logs -f user-service'
alias hd-journal='docker-compose logs -f journal-service'
alias hd-db='docker-compose logs -f postgres'

# 数据库别名
alias hd-psql='docker-compose exec postgres psql -U postgres -d happyday'
alias hd-redis='docker-compose exec redis redis-cli'

# 开发工具
alias hd-shell-user='docker-compose exec user-service sh'
alias hd-shell-journal='docker-compose exec journal-service sh'

echo "Happy Day 开发别名已加载！"
echo "使用 'hd-' 前缀访问各种命令"
EOF

chmod +x scripts/dev-aliases.sh
log_success "开发别名已创建在 scripts/dev-aliases.sh"

# 创建 README 开发指南
log_info "创建开发指南..."

cat > DEVELOPMENT.md << 'EOF'
# Happy Day 开发指南

## 快速开始

1. 运行开发环境设置：
   ```bash
   bash scripts/setup-dev-env.sh
   ```

2. 加载开发别名：
   ```bash
   source scripts/dev-aliases.sh
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
EOF

log_success "开发指南已创建: DEVELOPMENT.md"

# 最终总结
echo ""
echo "=================================="
log_success "🎉 开发环境设置完成！"
echo "=================================="

echo ""
log_info "服务访问地址："
echo "  🌐 前端:      http://localhost:3030"
echo "  👤 用户服务:  http://localhost:3001"
echo "  📝 日志服务:  http://localhost:3002"
echo "  🗄️  数据库:    localhost:5432"
echo "  🔄 Redis:     localhost:6379"

echo ""
log_info "下一步操作："
echo "  1. 加载开发别名: source scripts/dev-aliases.sh"
echo "  2. 查看服务状态: hd-ps"
echo "  3. 查看日志:     hd-logs"
echo "  4. 阅读开发指南: cat DEVELOPMENT.md"

echo ""
log_success "Happy Day 开发环境已就绪！开始愉快地编码吧！🚀"
