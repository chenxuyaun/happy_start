# Happy Day 前端后端集成指南

这个文档解释了如何将 Happy Day 前端应用连接到真实的后端 API。

## 🚀 快速开始

### 1. 环境变量配置

在项目根目录创建 `.env.local` 文件，配置你的后端API地址：

```env
# 后端API基础URL
REACT_APP_API_URL=http://localhost:8080/api

# 是否启用模拟数据 (false = 使用真实后端)
REACT_APP_USE_MOCK_DATA=false

# 调试模式
REACT_APP_DEBUG=true

# WebSocket连接URL
REACT_APP_WEBSOCKET_URL=ws://localhost:8080
```

### 2. 生产环境配置

对于生产环境，创建 `.env.production` 文件：

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_USE_MOCK_DATA=false
REACT_APP_DEBUG=false
REACT_APP_WEBSOCKET_URL=wss://your-api-domain.com
```

## 📊 服务架构

应用支持两种数据模式：

- **真实数据模式**: 连接后端API获取真实数据
- **模拟数据模式**: 使用本地模拟数据，用于开发和演示

### 服务管理器

`serviceManager` 提供了智能的服务切换功能：
- 自动检测后端连接状态
- 连接失败时自动切换到模拟数据
- 提供手动切换功能
- 服务代理模式，主服务失败时自动使用备用服务

## 🔌 API 端点

应用需要以下API端点：

### 认证服务
```
POST /auth/login - 用户登录
POST /auth/register - 用户注册
POST /auth/logout - 用户注销
POST /auth/forgot-password - 忘记密码
POST /auth/reset-password - 重置密码
POST /auth/refresh - 刷新token
GET /auth/validate - 验证token
```

### 用户服务
```
GET /user/profile - 获取用户信息
PUT /user/profile - 更新用户信息
PUT /auth/change-password - 修改密码
```

### 日记服务
```
GET /journal/entries - 获取日记列表
POST /journal/entries - 创建日记
PUT /journal/entries/:id - 更新日记
DELETE /journal/entries/:id - 删除日记
POST /journal/search - 搜索日记
GET /journal/emotion-analysis - 获取情绪分析
GET /journal/stats - 获取日记统计
GET /journal/tags - 获取标签列表
```

### 导出服务
```
POST /export/journal - 导出日记数据
POST /export/progress - 导出进度数据
POST /export/meditation - 导出冥想数据
POST /export/all - 导出全部数据
```

### 健康检查
```
GET /health - 服务健康检查
```

## 🔐 认证机制

应用使用 JWT (JSON Web Token) 进行身份认证：

1. 用户登录后，后端返回 `token` 和 `refreshToken`
2. 前端自动在请求头中添加 `Authorization: Bearer <token>`
3. Token 过期时，自动使用 `refreshToken` 刷新
4. 刷新失败时，自动跳转到登录页面

## 📦 请求/响应格式

### 标准响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入数据有误",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 分页响应格式
```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🛠️ 后端状态监控

应用内置了后端连接状态监控：

1. **状态指示器**: 在导航栏显示连接状态
2. **自动切换**: 连接失败时自动切换到模拟数据
3. **手动切换**: 可以手动在真实数据和模拟数据间切换
4. **连接测试**: 定期检查后端连接状态

### 使用状态指示器

点击导航栏右上角的状态芯片可以：
- 查看详细连接信息
- 手动切换数据模式
- 刷新连接状态
- 查看服务配置

## 🔧 开发调试

### 启用调试模式
设置环境变量 `REACT_APP_DEBUG=true` 启用调试模式，这将：
- 在控制台输出详细的API调用日志
- 显示服务切换状态
- 记录错误详情

### 使用模拟数据开发
在开发阶段，可以设置 `REACT_APP_USE_MOCK_DATA=true` 使用模拟数据：
- 无需后端即可开发前端功能
- 提供完整的模拟数据
- 支持所有核心功能

## 🚀 部署配置

### 构建应用
```bash
npm run build
```

### 环境变量检查
构建前确保环境变量正确设置：
```bash
echo $REACT_APP_API_URL
echo $REACT_APP_USE_MOCK_DATA
```

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/happy-day;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🛡️ 安全考虑

1. **HTTPS**: 生产环境必须使用HTTPS
2. **CORS**: 后端需要正确配置CORS策略
3. **Token安全**: JWT tokens 存储在 localStorage 中
4. **API限流**: 建议后端实现API限流
5. **输入验证**: 前后端都应进行输入验证

## 📈 性能优化

1. **请求缓存**: 使用 Redux 缓存数据
2. **分页加载**: 大列表数据支持分页
3. **懒加载**: 组件和路由懒加载
4. **图片优化**: 图片压缩和懒加载
5. **代码分割**: 按路由分割代码包

## 🐛 故障排除

### 常见问题

1. **连接失败**
   - 检查API地址是否正确
   - 确认后端服务是否运行
   - 检查网络连接和防火墙

2. **认证失败**
   - 检查token是否过期
   - 确认用户凭据是否正确
   - 查看浏览器控制台错误信息

3. **CORS错误**
   - 后端需要配置CORS允许前端域名
   - 检查请求头设置
   - 确认预检请求响应

### 调试步骤

1. 打开浏览器开发者工具
2. 查看Network标签中的API请求
3. 检查Console中的错误信息
4. 使用状态指示器查看连接状态
5. 尝试切换到模拟数据模式

## 📞 技术支持

如果遇到问题，可以：
1. 查看浏览器控制台错误信息
2. 检查网络请求状态
3. 使用应用内的反馈功能
4. 查看应用的后端状态指示器

## 🔄 版本更新

应用支持自动检查更新：
- 定期检查新版本
- 显示更新通知
- 提供更新日志
- 支持手动触发更新检查
