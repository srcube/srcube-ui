---
name: ui-design
description: Unified UI component workflow skill for srcube-ui-pro. Use when users ask to implement new components or iterate existing ones, including API design, UI/UX definition, React+Mini implementation, testing, and code review. Supports both interactive collaboration and full-auto delivery via four built-in agents: designer, developer, tester, reviewer.
---

# UI Design

统一组件技能，适用于两类任务：
- 实现新组件。
- 迭代已有组件（修复、补齐 API、重构、增强交互、补测试）。

本技能内置 4 个智能体角色，禁止使用 Architect 角色：
- `designer`：组件 API 设计、UI/UX 定义、实现边界。
- `developer`：组件开发实现，严格遵循开发实现规则。
- `tester`：编写和执行组件单元测试。
- `reviewer`：审查代码实现、类型错误、准则符合性。

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

- 以组件 `README.md` 的 API 表为唯一真相；React/Mini 必须字段、默认值、语义对齐。
- 单组件包多端实现：仅共享样式 tokens/variants，不共享逻辑与 props 类型。
- 样式统一通过 `src/style.ts` + slots/variants 输出；实现层禁止直接写 Tailwind class 字符串。
- React 端仅交互型组件使用 RAC（Button/Toggle/Slider 等）。
- Boolean 命名统一：`is/has/should/can`。
- 组件包依赖只允许 `@srcube-ui/runtime` 与 `@srcube-ui/theme`；禁止依赖 `@srcube-ui/react` / `@srcube-ui/mini`。
- Mini 聚合分发需兼容 `dist/<component>/index*` 且 `miniprogram: dist`。

## 智能体定义

### designer

目标：定义“可实现、可测试、跨端一致”的组件方案。

必须产出：
- README API 草案（props/events/默认值/平台差异）。
- `style.ts` 方案（slots/variants/compoundVariants/defaultVariants）。
- 实现边界说明：
  - 哪些状态在 `style.ts` 解决。
  - 哪些逻辑在 React/Mini 各自实现。
  - 需要补充到 README 的平台差异说明。

检查重点：
- API 是否与库内命名/语义一致。
- 是否过度暴露 props（保持最小必要 API）。
- 是否可被 `developer/tester` 直接落地。

### developer

目标：按设计稿完成双端实现并保持仓库结构一致。

必须执行：
- 实现 `src/react/*` 与 `src/mini/*`，并保持语义一致。
- 仅通过 `style.ts` slots 消费样式；不在实现层拼接 Tailwind。
- 按需要更新 `packages/react/src/index.ts` 与 `packages/mini/src/index.ts` 导出。
- 新组件或 API 变更时，同步 README 与示例应用（`apps/sample-react` / `apps/sample-mini`）。

禁止项：
- 引入聚合包依赖。
- 用 `any` 绕过公共 API 类型约束。
- 只改一端不改另一端（除非 README 明确平台差异）。

### tester

目标：覆盖行为、样式映射、回归场景，保证修改可验证。

必须执行：
- 维护 `__tests__/react.test.tsx` 与 `__tests__/mini.test.ts`。
- 覆盖核心场景：
  - 交互行为（tap/click、disabled、loading、受控/非受控）。
  - 样式映射（variant/size/radius/compound states）。
  - 回归风险（状态切换闪烁、边界输入、group 语义）。
- 执行并记录测试命令结果。

### reviewer

目标：发现阻断问题并给出可执行修复建议。

必须执行：
- 按优先级审查：API 一致性 -> 样式边界 -> 类型正确性 -> 运行行为 -> 架构边界。
- 输出 findings 严重度：`P0/P1/P2`。
- 对 `P0` 阻断项要求修复后再通过。

标准校验命令：
- `pnpm -C packages/ui/<component> build`
- `pnpm -C packages/ui/<component> test`
- `tsc -p packages/ui/<component>/tsconfig.react.json --noEmit`
- `tsc -p packages/ui/<component>/tsconfig.mini.json --noEmit`

## 编排流程

### 新组件
1. `designer` 产出 API + style 方案。
2. `developer` 完成 React/Mini 实现与文档/示例联动。
3. `tester` 补齐并执行测试。
4. `reviewer` 审查并驱动修复闭环。

### 迭代已有组件
1. `reviewer` 先快速定位问题与影响面。
2. `designer` 在必要时调整 API/交互与边界。
3. `developer` 实施改动。
4. `tester` 增量回归。
5. `reviewer` 复审收口。

## 输出要求

- 先给结果，再给过程。
- 明确列出：
  - 改动文件。
  - 执行命令与结论。
  - 若存在未完成项，说明阻塞原因与下一步。
- 代码审查场景必须 Findings 先行，按严重度排序。
