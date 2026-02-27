# UI 组件模板（_template）

`packages/ui/_template` 是创建新组件的起始模板，用于保证 React / Mini 双端结构统一、规则一致。

## 模板约定

- 单组件包多端实现：同包内包含 `style + react + mini`
- 双端逻辑独立：不共享逻辑与 props 类型
- 仅共享样式 tokens/variants：统一放在 `style.ts`
- API 语义一致：以组件 README 的 API 表为唯一真相
- Boolean props 命名必须是 `is/has/should/can`
- 实现层避免直接写 Tailwind 类，统一通过 `style.ts` + slots 输出
- RAC 仅用于交互型组件（Button/Toggle/Slider 等）
- Mini props 仅保留必要原生字段，其他按组件场景扩展

## 目录结构

```txt
src/
  style.ts        # 样式定义：tokens / slots / variants
  locale.ts       # 可选：仅国际化组件需要（如 listbox/src/locale.ts）
  react/          # React 实现
  mini/           # 小程序实现
  index.ts        # 导出入口
__tests__/
  react.test.tsx  # React 基础渲染与交互测试
  mini.test.ts    # Mini 模板/props/事件基础测试
```

`locale.ts` 只放 locale type / 文案映射 / 默认 locale，不放平台逻辑。

## 单元测试（__tests__）

- 每个组件包默认包含 `__tests__/react.test.tsx` 与 `__tests__/mini.test.ts`
- React 测试建议覆盖：渲染、核心 props、生效 class、关键交互回调
- Mini 测试建议覆盖：模板关键节点、默认 props、事件触发、基础数据绑定
- 测试命名保持稳定语义（描述行为，不描述实现细节）
- 执行命令：`pnpm -C packages/ui/<component> test`

## 创建流程

1. 复制 `_template` 到 `packages/ui/<component>`
2. 修改 `package.json`（`name` / `exports` / `types` / `miniprogram`）
3. 替换 `Component*` 命名为实际组件名
4. 实现 `src/style.ts`
5. 实现 `src/react/*`
6. 实现 `src/mini/*`
7. 完成组件 README（使用下方模板）
8. 若有国际化，再新增 `src/locale.ts` 并在双端复用

## 组件 README 模板

每个组件 README 建议使用下面结构（复制后替换占位符即可）：

~~~md
# <ComponentName>

<一行组件定位说明，支持 React / Mini 双端>

## 使用

### React

```tsx
import { <ComponentName> } from '@srcube-ui/<component>';

<<ComponentName> ... />
```

### Mini

```json
{
  "usingComponents": {
    "sr-<component>": "@srcube-ui/<component>/index"
  }
}
```

```xml
<sr-<component> ... />
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | 全平台 / React / Mini |

> 约束：API 表是唯一真相。React/Mini 必须一一对应（字段、默认值、语义）。

## Slots（仅在需要时）

### React

- `...`

### Mini

- `...`

## 平台差异

- React：<差异说明>
- Mini：<差异说明>

## 备注（可选）

- 可补充交互细节、受控/非受控说明、无障碍说明等。
~~~

### README 编写检查清单

- API 表是否覆盖了所有公开 props/事件
- React/Mini 示例是否可直接运行
- 平台差异是否仅描述“形式差异”，而不是“语义差异”
- 是否注明了默认行为（如 `defaultOpen`、`isDismissable` 等）
