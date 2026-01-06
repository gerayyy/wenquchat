# 问渠工作台 (WenquChat)

一个现代化的企业级多媒体智能工作台，集成聊天对话与知识看板功能，基于 React、TypeScript 和 Vite 构建。

## 🌟 项目概述

问渠工作台是一个创新的**对话 + 多媒体仪表盘**系统，采用**文资分离 (Text-Asset Separation)** 设计模式，将对话交互与多媒体资源管理完美融合。

### 核心设计理念
- **左侧对话控制台**：专注文本交互，保持指令清晰
- **右侧知识看板**：集中展示多媒体资源，视觉重心突出
- **深层预览支持**：支持 Office、PDF、PSD、视频等多种格式在线查看
- **引用闭环**：从资源库选择文件 → 抛回输入框 → 进行针对性问答

## 🏗️ 系统架构

### 前端架构
```
wenguichat-web/
├── src/
│   ├── components/          # React 组件库
│   │   ├── chat/          # 聊天控制台组件
│   │   ├── gallery/       # 知识看板组件
│   │   ├── layout/        # 布局组件
│   │   ├── preview/       # 预览组件
│   │   └── ui/            # 基础 UI 组件
│   ├── store/             # Zustand 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── lib/               # 工具函数和 API 封装
│   └── assets/            # 静态资源
├── public/                # 公共资源
└── 配置文件...           # Vite、TypeScript、Tailwind 等配置
```

### 技术栈
- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS + 自定义组件库
- **状态管理**：Zustand
- **UI 组件**：Radix UI + 自定义组件
- **媒体处理**：react-player、react-pdf、ag-psd 等

## 🎯 核心功能模块

### 1. 对话控制台 (Chat Console)
- **智能对话**：支持 Markdown 渲染、代码高亮
- **文件引用**：支持引用知识看板中的文件进行针对性提问
- **流式响应**：实时显示 AI 回复内容
- **消息管理**：完整的消息历史记录和管理

### 2. 知识看板 (Knowledge Dashboard)
- **资源网格**：卡片式展示多媒体资源
- **智能筛选**：按类型（图片/视频/文档）筛选资源
- **资源预览**：支持多种文件格式的在线预览
- **资源引用**：一键将资源添加到对话上下文

### 3. 统一文件预览器 (Universal Previewer)
#### 支持的文件类型
- **图片**：JPG、PNG、GIF、WebP、SVG
  - 缩放、平移、全屏查看
  - 灯箱效果展示
- **视频**：MP4、AVI、MOV、WMV、FLV、MKV
  - 自定义播放控制
  - 响应式设计
- **文档**：PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX
  - 完整的文档查看功能
  - 页面导航和缩放
- **设计文件**：PSD (Adobe Photoshop)
  - 图层查看和解析
  - 缩略图生成

### 4. 后端集成
- **Coze 工作流**：集成 Coze AI 工作流平台
- **素材库 API**：对接企业素材库系统
- **流式响应**：支持 Server-Sent Events 实时通信

## 📁 项目结构详解

### 组件架构
```
components/
├── chat/
│   └── ChatConsole.tsx           # 主聊天界面组件
├── gallery/
│   ├── MediaGallery.tsx          # 知识看板主组件
│   ├── AssetCard.tsx             # 资源卡片组件
│   ├── ImageViewer.tsx           # 图片查看器
│   ├── VideoPlayer.tsx           # 视频播放器
│   ├── PDFViewer.tsx             # PDF 查看器
│   ├── OfficeDocumentViewer.tsx  # Office 文档查看器
│   └── MediaDetailModal.tsx      # 媒体详情弹窗
├── layout/
│   └── MainLayout.tsx            # 主布局组件
├── preview/
│   └── UniversalPreviewer.tsx    # 统一预览器
└── ui/
    ├── button.tsx                # 按钮组件
    ├── card.tsx                  # 卡片组件
    ├── input.tsx                 # 输入框组件
    └── textarea.tsx              # 文本域组件
```

### 状态管理
```
store/
└── useWorkspaceStore.ts          # 全局状态管理
```

状态包含：
- 聊天历史记录
- 媒体资源列表
- 当前选中的资源
- 上下文文件列表

### 类型定义
```
types/
└── index.ts                      # TypeScript 类型定义
```

定义了所有核心接口：
- `MediaAsset`：媒体资源对象
- `Message`：消息对象
- `WorkspaceState`：工作台状态
- Coze API 相关类型

### 工具库
```
lib/
├── api.ts                        # API 封装和 Coze 集成
└── utils.ts                      # 工具函数
```

## 🚀 快速开始

### 环境要求
- Node.js 18 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
cd wenquchat-web
npm install
```

### 开发环境启动
```bash
npm run dev
```
访问 `http://localhost:5173` 查看应用

### 生产环境构建
```bash
npm run build
```

### 可用脚本
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 代码检查
- `npm run type-check` - 运行 TypeScript 类型检查

## 🔧 核心功能实现

### 分割面板布局
使用 `react-resizable-panels` 实现可拖拽的双栏布局：
- 左侧：对话控制台（默认 30%）
- 右侧：知识看板（默认 70%）
- 支持拖拽调整宽度比例

### 媒体资源管理
- 基于关键词智能生成相关资源
- 支持按类型筛选（全部/图片/视频/文档）
- 卡片式展示，支持悬停操作

### 文件预览系统
- 统一的预览器接口，根据文件类型自动选择查看器
- 支持全屏模态框预览
- 集成下载功能

### Coze 工作流集成
- 完整的 API 封装和错误处理
- 支持流式响应和超时控制
- 文件格式转换和验证

## 📋 开发记录

### 主要里程碑
1. **基础架构搭建** - React 19 + TypeScript + Vite 项目初始化
2. **UI 组件库** - Tailwind CSS + 自定义组件系统
3. **分割面板布局** - 实现可拖拽的双栏布局
4. **聊天功能** - 消息系统、Markdown 渲染、文件引用
5. **媒体看板** - 资源展示、筛选、预览功能
6. **文件预览器** - 多格式文件查看器集成
7. **Coze API 集成** - AI 工作流对接
8. **类型安全** - 完整的 TypeScript 类型定义
9. **构建优化** - 生产环境构建和性能优化

### 技术难点解决
- **TypeScript 编译错误修复** - 解决所有类型检查问题
- **文件格式支持** - 集成多种文件格式查看器
- **响应式设计** - 适配不同屏幕尺寸
- **状态管理** - 使用 Zustand 管理复杂状态

## 🔮 未来规划

### 功能增强
- [ ] 更多文件格式支持（AI、CAD 等）
- [ ] 高级搜索和筛选功能
- [ ] 文件标注和评论系统
- [ ] 协作功能（共享、权限管理）
- [ ] 移动端适配优化

### 性能优化
- [ ] 虚拟滚动优化大数据量展示
- [ ] 图片懒加载和压缩
- [ ] 文件预览缓存机制
- [ ] 构建体积优化

### 集成扩展
- [ ] 更多 AI 平台集成
- [ ] 企业 SSO 登录
- [ ] 云存储服务集成
- [ ] Webhook 和 API 扩展

## 📚 相关文档

- [设计文档](./设计文档.md) - 详细的设计规范和架构说明
- [开发记录](./开发记录.md) - 开发过程中的技术记录
- [接口文档](./接口文档.md) - 后端 API 接口说明
- [Coze 工作流说明](./coze工作流调用说明/) - Coze 平台集成文档

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

[根据实际项目许可证进行更新]

## 📞 支持与联系

如有问题或建议，请通过以下方式联系：
- 创建 GitHub Issue
- 发送邮件至 [联系邮箱]
- 访问项目文档获取更多信息

---

**问渠工作台** - 让企业知识触手可及 🚀