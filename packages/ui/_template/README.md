# 组件模板

用于创建 `packages/ui/<component>` 的基础模板，遵循移动端组件库的架构约束：双端独立实现、API 语义一致、仅共享样式 tokens/variants。

## 目录结构

```
src/
  style.ts        # 仅样式：variants/tokens
  react/          # React Web 实现
  mini/           # 小程序实现
```

> 提供 `src/index.ts` 作为默认入口，直接 re-export React 组件与 style。

## API 约定（语义一致）

- **props 语义一致**：同名 prop 表达相同含义（允许形态不同）。
- **Boolean 命名**：必须以 `is/has/should/can` 开头。
- **样式共享**：仅 `style.ts` 共享，逻辑不共享。
- **样式规则**：实现层避免直接写 Tailwind 类，统一通过 `style.ts` + slots 输出。

## API 同步规约（必须遵守）

- 组件 README 的 **API 表** 是唯一真相。
- React 与 Mini 的 API 字段、默认值、语义必须一一对应。
- 任一端新增/修改 API，必须同步更新另一端与 README。

## 平台差异说明（必须写入组件 README）

### React 端
- **使用 RAC 组件时**，`className` 支持函数式写法：
  - `className?: string | ((state) => string)`
  - `state` 为 RAC 提供的 `isPressed/isHovered/...` 等状态
- **不使用 RAC 时**，`className` 只能是 `string`
- **RAC 使用边界**：仅交互型组件（Button/Toggle/Slider 等）使用 RAC；展示型组件默认不用 RAC

### Mini 端
- `className` 仅支持 `string`
- `props` 直接用于 `properties`，必须包含原生属性
- **原生属性策略**：仅保留必要字段，其它按组件场景扩展

## 默认 props（模板内置）

### 通用
- `classNames?: VariantClasses`（slot 样式映射）
- variants（来自 `style.ts`）

### React
- `className`（RAC 时可函数）
- `style`（React CSSProperties）

### Mini
- `id?: string`
- `className?: string`
- `style?: string`
- `isDisabled?: boolean`

## 实现提示（React）

- 模板默认不使用 RAC，直接使用普通 DOM 元素
- 若需要 RAC：通过 `composeTwRenderProps` 合并 `className` + variants（参考 HeroUI v3 的合成方式）

示例（RAC）：

```ts
import { composeTwRenderProps } from "@srcube-ui/react";
import { Button as AriaButton } from "react-aria-components";

const styles = button({ variant: "solid" });

<AriaButton
  className={composeTwRenderProps(className, styles)}
>
  {children}
</AriaButton>
```

## 创建流程

1. 复制模板到 `packages/ui/<component>`
2. 修改 `package.json` 的 name/exports
3. 替换 `Component*` 命名
4. 先实现 `style.ts`（variants/tokens）
5. 再实现 `react/*`（按需使用 RAC）
6. 最后实现 `mini/*`（补全 properties）
7. 在组件 README 中补充 **平台差异说明** 与 API 表
