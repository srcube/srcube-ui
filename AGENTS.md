# AGENTS.md

## 项目概览
- 移动端组件库：React Web 与 Mini 独立实现。
- Workspace 分层：`@srcube-ui/runtime`（运行时）+ `@srcube-ui/react` / `@srcube-ui/mini`（聚合导出）。

## 开发环境
- Install deps: `pnpm install`
- Dev (root): `pnpm dev`
- Build (root): `pnpm build`

## 测试与校验
- Lint: `pnpm lint`
- Format: `pnpm format`
- Test: `pnpm test`

## 代码风格与规范
- 单组件包多端实现：仅共享样式 tokens/variants，不共享逻辑与 props 类型。
- 样式统一通过 `style.ts` + slots 输出，避免在实现层直接写 Tailwind 类。
- React 端仅交互型组件使用 RAC（Button/Toggle/Slider 等）。
- Mini 端 props 只保留必要原生字段，其它按组件场景扩展。
- Boolean 命名：`is/has/should/can`。
- 依赖方向：组件包只依赖 `@srcube-ui/runtime` 与 `@srcube-ui/theme`，禁止依赖聚合包 `@srcube-ui/react` / `@srcube-ui/mini`。
- Mini 聚合分发：`@srcube-ui/mini` 构建后产物路径为 `dist/<component>/index*`，并声明 `miniprogram: dist`。

## Template 规则
- README 的 API 表为唯一真相；React/Mini 必须一一对应（字段/默认值/语义）。
- `packages/ui/_template` 为组件模板，创建新组件从此复制。

## 文档与产出
- BMAD 产物统一放在 `_bmad-output/`。

## Team Skills
- **UI Design**: `skills/ui-design/SKILL.md` — 统一组件技能，内置 `designer/developer/tester/reviewer` 四个智能体，用于新组件实现与已有组件迭代（支持交互协作与全自动）。

## 示例应用
- `apps/sample-react` / `apps/sample-mini` 用于验证与回归。

## 关键路径
- 组件开发流程：`style.ts` → `react/*` → `mini/*` → README API 表
- API 同步：React/Mini 必须同时更新（以 README 为唯一真相）
