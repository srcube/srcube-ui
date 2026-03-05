# AGENTS.md

## 项目概览
移动端组件库，支持 React Web 与小程序双平台。
- Workspace 分层：`@srcube-ui/styles`（样式契约）+ `@srcube-ui/react` / `@srcube-ui/mini`（平台实现）

## 开发环境
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`

## 测试与校验
- Lint: `pnpm lint`
- Format: `pnpm format`
- Test: `pnpm test`

## 代码规范
- 样式契约在 `styles`，平台实现在 `react/mini`
- 样式通过 `style.ts` + slots 输出，禁止直接写 Tailwind 类
- `_` 前缀 slot 为内部私有，不对外暴露
- `$` 前缀 slot 仅用于小程序适配层”组件套组件”场景给子组件节点本身挂载 class（如 `$scrollbox`），React 不消费；非 `$` slot 保持通用语义
- React 交互组件使用 React Aria Components
- 小程序组件保留必要原生字段，其它按组件场景扩展
- 小程序组件本身就是一个节点，`class/style` 等原生样式需显式加在组件本身；布局依赖（如等分宽度）也应加在组件本身。若存在原生按钮事件，内部使用隐藏原生节点承载事件，外层仅负责样式
- 布尔命名：`is/has/should/can`
- 命名：组件名 `PascalCase`，包名 `kebab-case`，事件 `on*`
- 依赖方向：`react/mini` 仅依赖 `styles`，禁止互相依赖

## 层级规范
- Overlay/Modal 类组件遮罩层从 `z-index: 1000` 开始
- 弹窗内容层为遮罩层 `+1`（默认 `1001`）

## 组件结构
```txt
packages/styles/src/components/<name>/    # 样式契约
packages/react/src/components/<name>/     # React 实现
packages/mini/src/components/<name>/      # 小程序实现
packages/react/docs/components/<name>.md  # React 文档
packages/mini/docs/components/<name>.md   # 小程序文档
packages/react/__tests__/<name>/          # React 测试
packages/mini/__tests__/<name>/           # 小程序测试
```

## 开发流程
1. `styles` 定义样式契约
2. `react` 实现组件
3. `mini` 实现组件
4. 编写文档（分平台）
5. 编写测试（分平台）

## 开发约定
### 样式规范
- 样式定义统一在 `styles/components/<name>/style.ts`
- 使用 `tailwind-variants` 定义 variants 和 slots
- 实现层禁止直接写 Tailwind 类，必须通过 `style.ts` 输出
- 组件对外仅公开必要的 slots，内部私有 slots 以 `_` 开头

### API 规范
- 组件文档的 API 表是唯一真相
- React/Mini 必须保持字段、默认值、语义一致
- 平台差异仅限形式差异（如 `className` 类型），禁止语义差异

### React 规范
- 交互型组件（Button/Toggle/Slider 等）使用 React Aria Components
- `className` 支持函数式：`(state) => string`
- 事件命名统一为 `onTap`（而非 `onClick`）
- 支持 `isLoading=\"auto\"` 时 Promise 自动 loading

### Mini 规范
- 保留必要的原生 button/input 等字段
- 事件通过 `triggerEvent` 透传
- 支持 `isLoading=\"auto\"` 时 `e.detail.wait(Promise)` 自动 loading
- 组件本身是节点，布局样式需显式设置在组件上

### 测试规范
- React 测试覆盖：渲染、核心 props、class 生效、交互回调
- Mini 测试覆盖：模板节点、默认 props、事件触发、数据绑定
- 测试命名描述行为，不描述实现细节

### 国际化规范
- 需要国际化的组件在 `styles/components/<name>/locale.ts` 定义
- `locale.ts` 仅放 locale type / 文案映射 / 默认 locale
- 禁止在 `locale.ts` 放平台逻辑

## 示例应用
- `apps/sample-react` - React 验证
- `apps/sample-weapp` - 小程序验证

## Team Skills
- **UI Design**: `skills/ui-design/SKILL.md` - 组件开发技能（designer/developer/tester/reviewer）
