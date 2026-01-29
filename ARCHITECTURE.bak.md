# Monorepo Architecture

本仓库是一个“核心逻辑 + 多端适配 + 组件包”的移动端 UI 组件库。

## Workspace Layout

- `packages/core`：核心能力与基础设施
  - `@srcube-ui/core/theme`：Tailwind 插件、tokens（面向构建期/样式系统）
  - `@srcube-ui/core/react`：React 侧工具（如 `createContext`）
- `packages/shared`：跨包共享小工具（如 `assert`）
- `packages/ui/*`：组件包，每个组件按端拆分实现
  - `src/core`：跨端可复用的样式/类型/工具（不依赖平台全局）
  - `src/mini`：小程序组件壳（wxml/wxss/json + TS glue，常用 `miniprogram-computed`）
  - `src/react`：React 组件壳（TSX glue）
- `packages/ui.bak`：历史 Taro 组件包（当前被 `packages/**` 纳入 workspace；构建依赖 `tsup`）
- `envs/config`：共享配置（tsconfig 等）
- `packages/unplugin`：构建期插件（目前用于把小程序资源文件复制到 `dist`）
- `apps/*`：示例应用（React / 小程序）

Workspace 清单以 `pnpm-workspace.yaml` 为准；当前 `packages/**` 会包含 `packages/ui.bak`。

## Dependency Rules (建议)

目标是让“跨端 Core”长期保持可复用、可测试、可替换：

- `apps/*`：可以依赖 `packages/*` 与 `packages/ui/*`
- `packages/ui/*`：
  - `core` 只依赖 `@srcube-ui/core/theme` 与少量通用运行时库（避免平台耦合）
  - `mini` 依赖 `core` + `miniprogram-computed`（不使用 `@react-*`）
  - `react` 依赖 `core` + `@srcube-ui/core/react`；React 侧允许使用 `@react-stately/*`，但不使用 `@react-aria/*`
- `packages/core`：
  - `theme` 不应反向依赖 `ui`（避免循环与耦合）
  - `react` 仅提供轻量工具（如 `createContext`），避免引入业务逻辑
- `packages/unplugin`：仅用于构建期，不应被运行时代码依赖

## Public Imports

通过 `package.json#exports` 固定“公开 API”，避免深层路径引入：

- Core：
  - `@srcube-ui/core/theme`
  - `@srcube-ui/core/react`
- Shared：
  - `@srcube-ui/shared`
  - `@srcube-ui/shared/assert`
- Components：
  - `@srcube-ui/<component>`：导出样式与跨端类型/工具
  - `@srcube-ui/<component>/style`
  - `@srcube-ui/<component>/mini`
  - `@srcube-ui/<component>/react`

## Component Package Template

推荐新组件按如下模板落盘：

- `packages/ui/<name>/src/core/*`：跨端样式/类型/工具
- `packages/ui/<name>/src/style.ts`：样式与 Variant 类型导出
- `packages/ui/<name>/src/mini/index.{ts,wxml,wxss,json}`：小程序壳（常用 `ComponentWithComputed`）
- `packages/ui/<name>/src/react/*.tsx`：React 组件实现
- `packages/ui/<name>/src/index.ts`：导出样式与跨端类型/工具
- `packages/ui/<name>/tsconfig.{mini,react}.json`：分别设置 types/jsx
- `packages/ui/<name>/tsdown.config.ts`：构建公开入口 + 资源复制插件

模板目录：`packages/ui/_template`（不参与 workspace 构建），可直接复制并改名。

## Cross-Platform “Core” Checklist

- 不直接引用 `window/document/navigator` 等平台全局；需要环境判断时使用 `globalThis`（保证在小程序/Node/SSR 下安全）。
- 样式与行为分离：`common/core` 输出 className 协议与纯函数工具，平台壳负责事件/属性/渲染。
- React/Mini 端优先复用 `core` 的解析逻辑，避免平台间行为漂移。
- 视图表现一致：React 与 Mini 的结构层必须保持一致，slot 与 children 一一对应（同层级、同语义、同默认行为）。

## Q/A 细节补充

- 设计源与样式落地：`design/ui-ux` 存放 UI UX Pro Max 导出的 JSON tokens，目前人工挑选/定义组件变体（如 Button 的颜色/形状/尺寸/圆角）并写入 `packages/ui/<component>/src/core/style.ts`，暂无自动同步流程。
- Core 约定：跨端层以 `core` 为主，提供样式、类型与纯函数工具；当存在状态逻辑时，以显式工具或 class 暴露（如 `VirtualizerCore`），不强制 `createX` 形态。
- 参考实现：Button 将变体解析与样式统一放在 `src/core`（`style.ts`/`variants.ts`），React 与小程序壳共享 `resolveButtonVariant`，确保行为一致。
- React 适配：以 React 组件内部状态为主，组合 `core` 的样式与工具；跨组件上下文用 `@srcube-ui/core/react` 的 `createContext`。
- React 逻辑层依赖：React 组件逻辑层可使用 `@react-stately/*`（状态/行为建模），但不使用 `@react-aria/*`；小程序端不考虑这两类依赖。
- Mini 适配：使用 `Component`/`ComponentWithComputed`（来自 `miniprogram-computed`）组织计算字段与渲染状态；`setData` 需按需更新，避免无差别全量刷新。
- 原生属性/事件：组件调用时自身即节点（壳层），内部实现位于 shadow root；壳层需显式声明并透传 `class`/`style` 等原生属性，使用时注意给壳层设置必要样式；小程序 Action 区使用按钮类组件时，建议按钮组容器加 `w-full`、按钮本身加 `flex-1` 保证布局稳定一致；事件命名遵循布尔 `is/has/should/can`、事件 `on*`、处理 `handle*`。
