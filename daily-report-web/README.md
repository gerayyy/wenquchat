# 问渠·日报系统

基于 React + TypeScript + Vite 构建的企业微信日报管理系统。

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

项目会自动在浏览器中打开 `http://localhost:5173`

**开发环境说明**:
- 首次启动会自动使用测试 code 获取 token
- Token 有效期为 1天
- Token 保存在 localStorage 中，刷新页面不会失效
- 如需重新获取 token，在浏览器控制台执行：`localStorage.removeItem('wework_token')`

### 生产构建

```bash
npm run build
```

构建产物会生成在 `dist` 目录中。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── config/          # 配置文件
│   └── api.ts       # API 配置（BASE_URL, TOKEN_KEY, DEV_TEST_CODE）
├── utils/           # 工具函数
│   └── request.ts   # HTTP 请求封装
├── services/        # API 服务层
│   ├── auth.ts      # 鉴权服务
│   └── dailyCustomer.ts  # 客户日报服务
├── pages/           # 页面组件
│   ├── Home.tsx     # 首页
│   ├── Prepare.tsx  # 准备日报
│   ├── Fill.tsx     # 填写日报
│   ├── Success.tsx  # 提交成功
│   └── View.tsx     # 查看客户
├── components/      # UI 组件
│   ├── ui/          # 基础 UI 组件
│   └── layout/      # 布局组件
├── data/            # 数据相关
│   └── mock.ts      # Mock 数据（开发用）
├── lib/             # 库函数
│   └── utils.ts     # 工具函数
├── App.tsx          # 应用根组件
└── main.tsx         # 应用入口

```

## 技术栈

- **框架**: React 19.2.0
- **语言**: TypeScript 5.9.3
- **构建工具**: Vite 7.2.4
- **路由**: React Router DOM 7.11.0
- **样式**: Tailwind CSS 4.1.18
- **动画**: Framer Motion 12.24.7
- **图标**: Lucide React 0.562.0

## API 接口

项目已对接以下后端接口：

- `GET /auth/getToken` - 企业微信鉴权
- `POST /dailyCustomer/create` - 创建客户日报
- `GET /dailyCustomer/list` - 分页查询客户列表

**测试环境地址**: `http://test-salebot.yiyouliao.com/api`

详细接口文档请查看：`../日报接口V1.0-优化版.md`

## 开发文档

- [开发日志](../开发日志.md) - 详细记录每次开发修改
- [设计文档](../日报工作台设计.md) - 产品设计说明
- [接口文档](../日报接口V1.0-优化版.md) - 后端接口文档

## 常见问题

### 1. 如何更新测试 code？

编辑 `src/config/api.ts` 文件，修改 `DEV_TEST_CODE` 常量。

### 2. Token 过期怎么办？

在浏览器控制台执行以下命令清除 token：

```javascript
localStorage.removeItem('wework_token')
```

然后刷新页面，系统会自动重新获取 token。

### 3. 如何切换生产环境？

修改 `src/config/api.ts` 中的 `API_BASE_URL`，或使用环境变量：

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://test-salebot.yiyouliao.com/api';
```

然后在 `.env.production` 文件中配置：

```
VITE_API_BASE_URL=https://prod-api.example.com/api
```

### 4. 遇到 CORS 跨域问题？

在 `vite.config.ts` 中添加代理配置：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://test-salebot.yiyouliao.com',
        changeOrigin: true,
      }
    }
  }
})
```

## License

Private
