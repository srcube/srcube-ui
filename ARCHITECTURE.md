# 架构文档（从零开始）

## 1. 定位与目标
从零搭建一个跨端 UI 组件库：**单一组件包**，内部包含 **core + 多端实现（mini / react；vue 可选）**。每个端的逻辑实现互不影响，只共享**样式 tokens 与 props 定义**。

## 2. Workspace 范式（基础）
```
apps/
  sample-react/
  sample-mini/
packages/
  theme/               # 设计 tokens 与 Tailwind 插件（构建期/样式系统）
  react/               # React 侧通用工具（轻量）
  mini/                # 小程序侧通用工具（轻量）
  shared/              # 跨包共享小工具
  ui/
    <component>/       # 单一组件包（多端共存）
      src/
        style.ts       # 共享：tailwind 样式 tokens
        mini/          # 小程序实现（独立逻辑）
          props.ts     # mini 侧 props
        react/         # React 实现（独立逻辑）
          props.ts     # react 侧 props
        vue/           # Vue 实现（可选）
      src/index.ts     # 仅导出 style
      tsdown.config.ts
```

## 3. 组件包范式（核心）
- **单组件包**：每个组件独立一包，内部含共享 style + 多端实现层。
- **共享最小化**：只共享样式 tokens；props 各端维护。
- **API 同步**：语义必须一致，形式允许不同；通过 README 的 API 章节明确对齐项与差异项。
- **逻辑私域**：各端实现自行处理状态、交互与渲染。
- **导出清晰**：对外只暴露稳定入口，禁止深层路径依赖。

## 4. 代码范式（最小约束）
- 平台无关：core 不引用 `window/document/navigator`，用 `globalThis` 兼容。
- 样式与逻辑分离：仅共享 Tailwind tokens。
- 逻辑分端实现：平台侧不依赖其它平台代码。
- 命名统一：组件名 `PascalCase`，包名 `kebab-case`，事件 `on*`，布尔 `is/has/should/can`。
- 布尔 Props 规则：所有布尔型 props 必须使用 `is/has/should/can` 前缀。

## 5. 公开导入（exports 原则）
- `@srcube-ui/theme`
- `@srcube-ui/react`
- `@srcube-ui/mini`
- `@srcube-ui/shared`
- `@srcube-ui/<component>`
- `@srcube-ui/<component>/style`
- `@srcube-ui/<component>/mini`
- `@srcube-ui/<component>/react`
- `@srcube-ui/<component>/vue`（可选）

## 6. 构建与验证（基础）
- monorepo：pnpm workspace
- 任务编排：Turbo
- 构建：tsdown（组件包）
- 示例：apps 用于组件验证与回归
