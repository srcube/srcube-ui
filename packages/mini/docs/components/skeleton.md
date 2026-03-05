# Skeleton

用于加载阶段占位的骨架屏组件，支持 React 与小程序实现。

- 默认显示占位层，`isLoaded=true` 时显示真实内容
- 仅共享 `style.ts` 的 tokens/variants，双端逻辑独立
- 支持通过 `radius` 控制占位层圆角

## 使用

### API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| isLoaded | 是否显示真实内容（`false` 时显示骨架占位） | `boolean` | `false` | 全平台 |
| radius | 占位层圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| className | 根节点 class | `string` | - | 全平台 |
| classNames | slots 样式映射（`base/content/placeholder`） | `SkeletonClassNames` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 平台差异

- 透传组件根节点 `id/style/className`。
- `children` 通过默认 `slot` 传入，`isLoaded=false` 时仅隐藏透明度，用于保持布局尺寸。
