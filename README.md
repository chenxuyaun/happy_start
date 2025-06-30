# 🌸 Happy Day - 企业级心理治愈公益项目

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![Go](https://img.shields.io/badge/go-1.21+-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-yellow.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![Kubernetes](https://img.shields.io/badge/kubernetes-ready-blue.svg)

一个结合吉卜力风格的企业级数字花园心理治愈平台，专注于为用户提供温暖、安全、有效的心理健康支持。

## 🎯 项目概述

Happy Day 是一个创新的心理健康平台，结合了：
- 🌺 **吉卜力风格的3D数字花园** - 沉浸式治愈体验
- 🤖 **AI驱动的情绪分析** - 智能个性化治疗方案
- 🏥 **企业级安全与合规** - GDPR/HIPAA标准
- 🌐 **VR/AR支持** - 多维度沉浸体验
- 👥 **社区支持系统** - 安全的社交治愈环境

## 🏗️ 架构设计

### 微服务架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile Client  │    │   VR/AR Client  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │       API Gateway         │
                    │   (认证/限流/路由)          │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌──────────▼─────────┐    ┌─────────▼────────┐
│   User Service │    │   Garden Service   │    │   AI Service     │
│   (NestJS)     │    │      (Go)          │    │   (Python)       │
└────────────────┘    └────────────────────┘    └──────────────────┘
        │                         │                         │
        │              ┌──────────▼─────────┐               │
        │              │  Journal Service   │               │
        │              │    (NestJS)        │               │
        │              └────────────────────┘               │
        │                         │                         │
┌───────▼─────────────────────────▼─────────────────────────▼───────┐
│                        Database Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ PostgreSQL  │ │    Redis    │ │Elasticsearch│ │  TimescaleDB│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 系统要求
- **Node.js** 18+
- **Go** 1.21+
- **Python** 3.11+
- **Docker** & **Docker Compose**
- **Git**

### 一键环境设置

```powershell
# 完整开发环境设置
.\scripts\dev-setup.ps1 -Full

# 或分步设置
.\scripts\dev-setup.ps1 -Database
.\scripts\dev-setup.ps1 -Frontend
.\scripts\dev-setup.ps1 -Backend
.\scripts\dev-setup.ps1 -AI
```

### 手动设置步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd happy-day
```

2. **启动基础设施**
```bash
docker-compose up -d postgres redis elasticsearch
```

3. **安装依赖**
```bash
# 前端
cd frontend && npm install

# 用户服务
cd services/user-service && npm install

# 花园服务
cd services/garden-service && go mod download

# AI服务
cd services/ai-service && pip install -r requirements.txt
```

4. **启动服务**
```bash
# 并行启动所有服务
npm run dev
```

## 📁 项目结构

```
happy-day/
├── apps/                          # 客户端应用
│   ├── web/                       # React Web应用
│   ├── mobile/                    # React Native应用
│   └── vr/                        # WebXR/A-Frame VR应用
├── services/                      # 微服务
│   ├── api-gateway/               # API网关 (NestJS)
│   ├── user-service/              # 用户服务 (NestJS)
│   ├── garden-service/            # 花园服务 (Go)
│   ├── journal-service/           # 日志服务 (NestJS)
│   ├── ai-service/                # AI服务 (Python/FastAPI)
│   └── notification-service/      # 通知服务 (NestJS)
├── libs/                          # 共享库
│   └── shared/                    # 共享类型定义和工具
├── infrastructure/                # 基础设施代码
│   ├── k8s/                       # Kubernetes配置
│   └── terraform/                 # Terraform配置
├── database/                      # 数据库脚本
├── monitoring/                    # 监控配置
├── docs/                          # 项目文档
└── scripts/                       # 自动化脚本
```

## 🛠️ 技术栈

### 前端技术
- **React 18** + **TypeScript** - 现代化前端开发
- **Three.js** + **React Three Fiber** - 3D渲染引擎
- **A-Frame** + **WebXR** - VR/AR支持
- **Material-UI** - 吉卜力风格UI组件
- **Redux Toolkit** - 状态管理
- **Socket.IO** - 实时通信

### 后端技术
- **NestJS** - 企业级Node.js框架
- **Go** + **Gin** - 高性能服务
- **Python** + **FastAPI** - AI微服务
- **GraphQL** + **REST API** - 灵活API设计
- **gRPC** - 服务间通信

### AI与机器学习
- **Transformers** - 情绪分析模型
- **spaCy** - 自然语言处理
- **PyTorch** - 深度学习框架
- **Sentence Transformers** - 语义理解

### 数据存储
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **Elasticsearch** - 全文搜索
- **TimescaleDB** - 时序数据分析

### DevOps与监控
- **Docker** + **Kubernetes** - 容器化部署
- **Prometheus** + **Grafana** - 监控和可视化
- **ELK Stack** - 日志分析
- **Jaeger** - 分布式追踪

## 🔧 开发指南

### 本地开发

1. **启动数据库**
```bash
docker-compose up -d postgres redis
```

2. **启动服务**
```bash
# 终端1 - 用户服务
cd services/user-service
npm run start:dev

# 终端2 - 花园服务
cd services/garden-service
go run cmd/main.go

# 终端3 - AI服务
cd services/ai-service
uvicorn app.main:app --reload

# 终端4 - 前端
cd frontend
npm start
```

### 代码规范

```bash
# 代码格式化
npm run lint
npm run format

# 类型检查
npm run type-check

# 测试
npm run test
```

## 🧪 测试策略

### 测试类型
- **单元测试** - Jest/Go test/Pytest
- **集成测试** - Supertest/TestContainers
- **端到端测试** - Cypress/Playwright
- **性能测试** - Artillery/Locust
- **AI模型测试** - 自定义评估框架

### 运行测试
```bash
# 全部测试
npm run test

# 覆盖率报告
npm run test:coverage

# E2E测试
npm run test:e2e
```

## 🚢 部署指南

### 开发环境
```bash
docker-compose up -d
```

### 生产环境 (Kubernetes)
```bash
# 部署到Kubernetes
kubectl apply -f infrastructure/k8s/

# 监控部署状态
kubectl get pods -n happy-day
```

### CI/CD流水线
- **构建** - Docker镜像构建
- **测试** - 自动化测试套件
- **安全扫描** - 容器安全检查
- **部署** - 蓝绿部署策略

## 📊 监控与运维

### 关键指标
- **用户体验** - 页面加载时间、交互响应
- **业务指标** - 用户活跃度、治愈效果
- **技术指标** - 服务可用性、数据库性能
- **AI性能** - 模型推理时间、准确率

### 告警机制
- **服务健康** - 自动故障检测与恢复
- **异常检测** - AI驱动的异常行为识别
- **容量规划** - 智能资源伸缩

## 🔐 安全与合规

### 数据保护
- **端到端加密** - AES-256加密
- **数据匿名化** - K-匿名算法
- **访问控制** - RBAC权限系统
- **审计日志** - 完整操作记录

### 合规标准
- **GDPR** - 欧盟数据保护条例
- **HIPAA** - 美国健康保险便民法案
- **SOC 2** - 安全运营控制

## 🤝 贡献指南

### 开发流程
1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

### 代码审查
- **自动检查** - CI/CD流水线验证
- **人工审查** - 至少2名开发者审查
- **安全审查** - 安全团队审查敏感更改

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持与联系

- **文档** - [项目Wiki](docs/)
- **问题反馈** - [GitHub Issues](issues/)
- **讨论** - [GitHub Discussions](discussions/)
- **邮箱** - support@happyday.org

---

## 🌟 特别致谢

感谢所有为心理健康事业贡献力量的开发者和心理健康专家。

让我们一起创造一个更温暖、更治愈的数字世界。🌸

---

*Made with ❤️ for mental health*
