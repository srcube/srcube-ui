# UI 组件生成工作流（AGENT 指令）

目标：当用户要求“生成某某组件”时，Agent 必须严格执行以下步骤，不可省略。

## 0. 前置确认
- 明确组件名称、平台（React/Mini）、是否需要 Group、是否需要自定义图标 slot。
- 若用户未明确：先询问，再执行。

## 1. 复制模板（必须）
- 从 `packages/ui/_template` 复制到 `packages/ui/<component>`。
- 修改 `package.json`：
  - `name` 改为 `@srcube-ui/<component>`。
  - `exports`、`types`、`miniprogram` 指向新包。
- 保留 `src/index.ts`、`src/style.ts`，**不新增 core 层**。

## 2. 实现（必须）
- `src/style.ts`：
  - 使用 `tv` 定义 slots / variants。
  - 布尔型 props 必须 `is/has/should/can` 前缀。
  - 默认图标样式必须使用私有 slot 命名 `_iXXX`（不暴露在 `classNames`）。
- React 端：
  - 独立实现（RAC 仅用于 React）。
  - `className` 支持函数式写法。
  - `props` 继承原生属性。
- Mini 端：
  - 独立实现。
  - 组件自身是节点，布局/原生样式需要在组件本身设置。
  - `props` 继承原生属性，按小程序规范。
- README（中文）：
  - 使用方式 + API 表（API 语义一致，平台差异明确）。

## 3. 构建配置（必须）
- 配置 `tsdown.config.ts`：
  - Mini 入口（`miniEntries`）
  - `miniCopy` 拷贝 wxml/wxss/json/wxs
- 配置 `tsconfig.react.json` / `tsconfig.mini.json`：
  - include 对应入口

## 4. Lint / Check（必须）
- 执行：`pnpm lint`
- 如有问题：`pnpm lint:fix`

## 5. Build（必须）
- 执行：`pnpm -C packages/ui/<component> build`

## 6. Test（必须）
- 执行：`pnpm -C packages/ui/<component> test`

## 7. Sample（必须）
- React：
  - 在 `apps/sample-react` 增加路由与示例页。
- Mini：
  - 在 `apps/sample-mini` 增加页面与配置。
- 示例覆盖所有核心 props（Colors / Variants / Sizes / States / Group 等）。

## 8. 最终自检（必须）
- React / Mini API 语义一致。
- README API 表为权威。
- 示例运行通过，构建产物 `dist` 可引用。
