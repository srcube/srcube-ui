---
name: ui-design
description: Unified UI component workflow skill for srcube-ui. Use when users ask to implement new components or iterate existing ones, including API design, UI/UX definition, React+Mini implementation, testing, and code review. Supports both interactive collaboration and full-auto delivery via four built-in agents - designer, developer, tester, reviewer.
---

# UI Design

统一组件技能，适用于两类任务：
- 实现新组件
- 迭代已有组件（修复、补齐 API、重构、增强交互、补测试）

本技能内置 4 个智能体角色：
- `designer`：组件 API 设计、UI/UX 定义、实现边界
- `developer`：组件开发实现，严格遵循开发规则
- `tester`：编写和执行组件单元测试
- `reviewer`：审查代码实现、类型错误、准则符合性

## 执行模式

### 模式 A：交互协作（默认）
在信息不足或用户希望共同设计时使用。

执行方式：
1. `designer` 先输出 API/交互草案并与用户确认关键取舍。
2. `developer` 按确认稿实现 React/Mini。
3. `tester` 补齐测试并执行。
4. `reviewer` 给出 findings（P0/P1/P2），若有阻断项则回流给 `developer` 修复。

### 模式 B：全自动
当用户明确要求“全自动/直接做完/不要反复确认”时使用。

执行方式：
1. 直接从需求推导默认 API 与交互方案。
2. 自动完成 `designer -> developer -> tester -> reviewer` 全链路。
3. 阻断问题在内部循环修复，直到无阻断项或遇到真实外部阻塞。
4. 最终仅向用户汇报结果、关键取舍、风险与后续建议。

## 全局准则（所有角色必须遵守）

### 架构约束
- 组件文档的 API 表为唯一真相；React/Mini 必须字段、默认值、语义对齐
- 三层架构：`styles`（样式契约）+ `react`（React 实现）+ `mini`（小程序实现）
- 依赖边界：`react/mini` 仅依赖 `styles`，禁止互相依赖

### 样式规范
- 样式定义在 `packages/styles/src/components/<name>/style.ts`，使用 tailwind-variants
- 实现层禁止直接写 Tailwind 类，必须通过 style.ts 输出
- `_` 前缀 slot 为内部私有，不对外暴露
- `$` 前缀 slot 仅用于小程序"组件套组件"场景给子组件节点本身挂载 class（如 `$scrollbox`），React 不消费；非 `$` slot 保持通用语义

### API 规范
- 布尔 props 命名：`is/has/should/can`
- 命名：组件名 `PascalCase`，包名 `kebab-case`，事件 `on*`
- 平台差异仅限形式差异（如 className 类型），禁止语义差异

### React 规范
- 交互组件使用 React Aria Components
- `className` 支持函数式：`(state) => string`
- 事件命名统一为 `onTap`（而非 onClick）
- 支持 `isLoading="auto"` 时 Promise 自动 loading

### Mini 规范
- 保留必要的原生字段，其它按组件场景扩展
- 支持 `isLoading="auto"` 时 `e.detail.wait(Promise)` 自动 loading
- 小程序组件本身就是一个节点，`class/style` 等原生样式需显式加在组件本身；布局依赖（如等分宽度）也应加在组件本身。若存在原生按钮事件，内部使用隐藏原生节点承载事件，外层仅负责样式

### 国际化规范
- 需要国际化的组件在 `packages/styles/src/components/<name>/locale.ts` 定义
- locale.ts 仅放 locale type / 文案映射 / 默认 locale
- 禁止在 locale.ts 放平台逻辑

## 智能体定义

### designer

目标：定义”可实现、可测试、跨端一致”的组件方案。

必须产出：
- 组件文档 API 草案（props/events/默认值/平台差异）
- `packages/styles/src/components/<name>/style.ts` 方案（slots/variants/compoundVariants/defaultVariants）
- 实现边界说明：
  - 哪些状态在 `style.ts` 解决
  - 哪些逻辑在 React/Mini 各自实现
  - 需要补充的平台差异说明

检查重点：
- API 是否与库内命名/语义一致
- 是否过度暴露 props（保持最小必要 API）
- 是否可被 `developer/tester` 直接落地

### developer

目标：按设计稿完成双端实现并保持架构一致。

必须执行：
- 实现 `packages/styles/src/components/<name>/style.ts`
- 实现 `packages/react/src/components/<name>/*`
- 实现 `packages/mini/src/components/<name>/*`
- 编写文档：`packages/react/docs/components/<name>.md` 和 `packages/mini/docs/components/<name>.md`
- 更新导出：`packages/react/src/index.ts` 和 `packages/mini/src/index.ts`
- 更新示例：`apps/sample-react` 和 `apps/sample-weapp`

禁止项：
- 跨平台依赖（react 依赖 mini 或反之）
- 用 `any` 绕过类型约束
- 只改一端不改另一端（除非文档明确平台差异）

### tester

目标：覆盖行为、样式映射、回归场景，保证修改可验证。

必须执行：
- 维护 `packages/react/__tests__/<name>/*.test.tsx`
- 维护 `packages/mini/__tests__/<name>/*.test.ts`
- 覆盖核心场景：
  - 交互行为（tap/click、disabled、loading、受控/非受控）
  - 样式映射（variant/size/radius/compound states）
  - 回归风险（状态切换、边界输入、group 语义）
- 执行并记录测试结果

### reviewer

目标：发现阻断问题并给出可执行修复建议。

必须执行：
- 按优先级审查：API 一致性 -> 样式边界 -> 类型正确性 -> 运行行为 -> 架构边界
- **迭代已有组件时，必须判断变更类型**：
  - API 变更（影响组件契约）：需双平台同步修改
  - 平台特定修改（仅影响实现细节）：可单平台修改
  - 若不确定，默认要求双平台同步
- 输出 findings 严重度：`P0/P1/P2`
- 对 `P0` 阻断项要求修复后再通过

标准校验命令：
- `pnpm -C packages/styles build`
- `pnpm -C packages/react build`
- `pnpm -C packages/mini build`
- `pnpm test`

## 编排流程

### 新组件
1. `designer` 产出 API + style 方案
2. `developer` 完成 styles/react/mini 实现与文档
3. `tester` 补齐并执行测试
4. `reviewer` 审查并驱动修复闭环

### 迭代已有组件
1. `reviewer` 先快速定位问题与影响面
2. `designer` 在必要时调整 API/交互与边界
3. `developer` 实施改动
4. `tester` 增量回归
5. `reviewer` 复审收口

## 输出要求

- 先给结果，再给过程
- 明确列出：
  - 改动文件
  - 执行命令与结论
  - 若存在未完成项，说明阻塞原因与下一步
- 代码审查场景必须 Findings 先行，按严重度排序
