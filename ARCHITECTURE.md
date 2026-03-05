# 架构文档

## 1. 定位与目标
移动端组件库，支持 React Web 与小程序双平台，采用分层架构：
- `styles`：跨平台共享样式契约（theme + variants）
- `react`：React 平台组件实现
- `mini`：小程序平台组件实现

核心目标：
- 单仓维护，平台实现隔离
- mini 构建零 React 依赖污染
- 双平台 API 语义一致，实现独立演进

## 2. Workspace 结构
```txt
apps/
  sample-react/          # React 示例应用
  sample-mini/           # 小程序示例应用
packages/
  styles/                # 样式契约层
    src/
      theme/             # design tokens
      components/        # 组件样式契约
      shared/            # tv 工具
  react/                 # React 实现层
    src/
      components/        # React 组件
      shared/            # React 工具
    docs/                # React 组件文档
    __tests__/           # React 测试
  mini/                  # 小程序实现层
    src/
      components/        # 小程序组件
      shared/            # 小程序工具
    docs/                # 小程序组件文档
    __tests__/           # 小程序测试
  _config/               # 共享构建配置
  _storybook/            # 文档工程配置
```

## 3. 分层职责
### `@srcube-ui/styles`
- design tokens / theme 配置
- 组件 variants / slots 契约（基于 tailwind-variants）
- 禁止：React/mini 运行时逻辑、DOM/小程序 API

### `@srcube-ui/react`
- React 组件实现（基于 React Aria Components）
- 样式消费自 `@srcube-ui/styles`
- 禁止依赖 `@srcube-ui/mini`

### `@srcube-ui/mini`
- 小程序组件实现（wxml/wxss/js）
- 样式消费自 `@srcube-ui/styles`
- 禁止依赖 `@srcube-ui/react`

### `@srcube-ui/config` 与 `@srcube-ui/storybook`
- `_config`：tsconfig/构建配置基座
- `_storybook`：文档/演示工程配置

## 4. 依赖边界
- `styles` 不依赖任何平台包
- `react` 仅依赖 `styles`，禁止依赖 `mini`
- `mini` 仅依赖 `styles`，禁止依赖 `react`
- 禁止 `react <-> mini` 循环依赖

## 5. 组件结构
每个组件按以下结构组织：
```txt
packages/styles/src/components/button/
  index.ts              # 样式契约导出
  style.ts              # variants 定义

packages/react/src/components/button/
  index.ts              # React 组件实现
  button.tsx
  button-group.tsx

packages/mini/src/components/button/
  index.ts              # 小程序组件脚本
  index.wxml
  index.wxss
  index.json

packages/react/docs/components/button.md    # React 文档
packages/mini/docs/components/button.md     # 小程序文档

packages/react/__tests__/button/button.test.tsx
packages/mini/__tests__/button/button.test.ts
```

## 6. 开发流程
组件开发顺序：
1. `styles/components/<name>/style.ts` - 定义样式契约（tokens/slots/variants）
2. `react/src/components/<name>/` - 实现 React 组件
3. `mini/src/components/<name>/` - 实现小程序组件
4. `react/docs/components/<name>.md` - React 文档
5. `mini/docs/components/<name>.md` - 小程序文档
6. `react/__tests__/<name>/` - React 测试
7. `mini/__tests__/<name>/` - 小程序测试

## 7. 开发约定

### 7.1 样式规范
- 样式定义统一在 `styles/components/<name>/style.ts`
- 使用 tailwind-variants 定义 variants 和 slots
- 实现层禁止直接写 Tailwind 类，必须通过 style.ts 输出
- `_` 前缀 slot 为内部私有，不对外暴露
- `$` 前缀 slot 仅用于小程序适配层“组件套组件”场景给子组件节点本身挂载 class（如 `$scrollbox`），React 不消费；非 `$` slot 保持通用语义

### 7.2 API 规范
- 组件文档的 API 表是唯一真相
- React/Mini 必须保持字段、默认值、语义一致
- 布尔 props 命名：`is/has/should/can`
- 平台差异仅限形式差异（如 className 类型），禁止语义差异
- 命名：组件名 `PascalCase`，包名 `kebab-case`，事件 `on*`

### 7.3 React 规范
- 交互型组件（Button/Toggle/Slider 等）使用 React Aria Components
- `className` 支持函数式：`(state) => string`
- 事件命名统一为 `onTap`（而非 onClick）
- 支持 `isLoading="auto"` 时 Promise 自动 loading

### 7.4 Mini 规范
- 保留必要的原生字段，其它按组件场景扩展
- 支持 `isLoading="auto"` 时 `e.detail.wait(Promise)` 自动 loading
- 小程序组件本身就是一个节点，`class/style` 等原生样式需显式加在组件本身；布局依赖（如等分宽度）也应加在组件本身。若存在原生按钮事件，内部使用隐藏原生节点承载事件，外层仅负责样式

### 7.5 测试规范
- React 测试覆盖：渲染、核心 props、class 生效、交互回调
- Mini 测试覆盖：模板节点、默认 props、事件触发、数据绑定
- 测试命名描述行为，不描述实现细节

### 7.6 国际化规范
- 需要国际化的组件在 `styles/components/<name>/locale.ts` 定义
- locale.ts 仅放 locale type / 文案映射 / 默认 locale
- 禁止在 locale.ts 放平台逻辑

### 7.7 依赖规范
- `react/mini` 仅依赖 `styles`，禁止互相依赖

## 8. 构建与验收
- monorepo: pnpm workspace + Turbo
- 构建工具: tsdown (基于 Rolldown)
- 样式处理: Tailwind CSS + tailwind-variants

验收标准：
- mini 产物无 React 依赖（检查 dist/@mini）
- react 产物无 mini 符号（检查 dist）
- 双平台 API 语义一致（对照文档 API 表）
- 示例应用正常运行（apps/sample-react、apps/sample-mini）

## 9. 文档规范
每个组件必须提供双平台文档：
- `react/docs/components/<name>.md`
- `mini/docs/components/<name>.md`

文档结构：
```md
# ComponentName

<组件定位说明>

## 使用
<平台特定的使用示例>

## API
<API 表，标注平台支持情况>

## 特性
<平台特定特性说明>

## Slots（可选）
<slots 说明>
```
