# 架构文档

## 1. 定位与目标
从零搭建一个跨端 UI 组件库：**单一组件包**，内部包含 **style + 多端实现（mini / react）**。每个端的逻辑实现互不影响，只共享**样式 tokens**；props 各端独立维护。

## 2. Workspace 范式
```
apps/
  sample-react/
  sample-mini/
packages/
  config/              # 共享 tsconfig（mini/react）
  theme/               # 设计 tokens 与 Tailwind 插件（构建期/样式系统）
  react/               # React 侧通用工具（轻量）
  mini/                # 小程序侧通用工具（轻量）
  shared/              # 跨包共享小工具
  ui/
    <component>/       # 单一组件包（多端共存）
      src/
        style.ts       # 共享：tailwind 样式 tokens
        mini/          # 小程序实现（独立逻辑）
          index.ts     # 小程序逻辑
          index.wxml   # 小程序结构
          index.wxss   # 小程序样式
          index.json   # 小程序声明
          props.ts     # mini 侧 props
        react/         # React 实现（独立逻辑）
          index.tsx    # React 组件
          props.ts     # react 侧 props
      src/index.ts     # 仅导出 style
      tsdown.config.ts
```

## 3. 组件包范式
- **单组件包**：每个组件独立一包，内部含共享 style + 多端实现层。
- **共享最小化**：只共享样式 tokens；props 各端维护。
- **API 同步**：语义必须一致，形式允许不同；通过 README 的 API 章节明确对齐项与差异项。
- **逻辑私域**：各端实现自行处理状态、交互与渲染。
- **导出清晰**：对外只暴露稳定入口，禁止深层路径依赖。

### Template Governance（模板规则）
- **API 同步**：组件 README 的 API 表为唯一真相；React/Mini 必须一一对应。
- **Sample 对齐规则**：`apps/sample-react` 与 `apps/sample-mini` 的同组件示例必须覆盖一致的核心场景（如 colors/variants/states），并尽量保持一致的交互模型（例如使用 ButtonGroup 进行颜色切换）；如需平台差异，必须在组件 README 说明原因。
- **RAC 使用边界**：仅交互型组件使用 RAC（Button/Toggle/Slider 等）。
- **样式规则**：实现层避免直接写 Tailwind 类，统一通过 `style.ts` + slots 输出。
- **`$xxx` slots 规则**：`$` 前缀 slot 为适配层专用命名，仅用于小程序实现里“组件套组件”场景下给子组件节点本身挂载 class（例如 `$scrollbox`）；React 侧不消费这类 slot。非 `$` slot 保持通用语义（用于组件自身结构或透传到子组件公开样式入口，如 `className/classNames`）。
- **Mini 原生属性策略**：仅保留必要字段，其它按组件场景扩展。
- **Mini 节点约定**：小程序组件本身就是一个节点，`class/style` 等原生样式需显式加在组件本身；布局依赖（如等分宽度）也应加在组件本身。若存在原生按钮事件，内部使用隐藏原生节点承载事件，外层仅负责样式。

## 4. 代码范式
- 平台无关：共享样式/工具层不引用 `window/document/navigator`，用 `globalThis` 兼容。
- 样式与逻辑分离：仅共享 Tailwind tokens。
- tv 统一入口：业务统一写 `@srcube-ui/theme/tv`，构建侧做分端别名（Web → tv-web，Mini → tv-mini）。
- 逻辑分端实现：平台侧不依赖其它平台代码。
- 命名统一：组件名 `PascalCase`，包名 `kebab-case`，事件 `on*`，布尔 `is/has/should/can`。
- 布尔 Props 规则：所有布尔型 props 必须使用 `is/has/should/can` 前缀。

## 5. 公开导入
- `@srcube-ui/theme`
- `@srcube-ui/react`
- `@srcube-ui/mini`
- `@srcube-ui/shared`
- `@srcube-ui/config`
- `@srcube-ui/<component>`
- `@srcube-ui/<component>/style`
- `@srcube-ui/<component>/mini`
- `@srcube-ui/<component>/react`

## 6. 构建与验证
- monorepo：pnpm workspace
- 任务编排：Turbo
- 构建：tsdown（组件包）
- 示例：apps 用于组件验证与回归

## 7. 文档位置
- BMAD 产物统一放在 `_bmad-output/`（包含 prd / architecture / sprint / stories）


## 8. 层级规范
- Overlay/Modal 类组件遮罩层从 `z-index: 1000` 开始。
- 弹窗内容层为遮罩层 `+1`（默认 `1001`）。
