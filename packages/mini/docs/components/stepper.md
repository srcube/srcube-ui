# Stepper

用于数值步进输入的组件，支持 React 与小程序实现。

- 基于 `Field` 复用标签/描述/错误信息能力
- 左右操作按钮复用 `Button` 组件
- 支持受控 / 非受控（`value` / `defaultValue`）
- 支持 `min` / `max` / `step` / `precision`

## 使用

### API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 当前值（受控） | `number \| null` | - | 全平台 |
| defaultValue | 默认值（非受控） | `number` | `0` | 全平台 |
| min | 最小值 | `number \| null` | - | 全平台 |
| max | 最大值 | `number \| null` | - | 全平台 |
| step | 步进值（必须大于 0） | `number` | `1` | 全平台 |
| precision | 小数位（`-1` 时跟随 `step`） | `number` | `-1` | 全平台 |
| label | 标题 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| labelPlacement | 标题位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` | 全平台 |
| description | 描述文案 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| errorMessage | 错误文案 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| variant | 视觉风格 | `"outline" \| "twotone"` | `"outline"` | 全平台 |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| isDisabled | 禁用状态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读状态 | `boolean` | `false` | 全平台 |
| className | 根节点 class | `string` | - | 全平台 |
| classNames | slots 样式映射（`base/decrementButton/incrementButton/valueWrap/input`） | `StepperClassNames` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| onValueChange | 值变化回调 | `(value: number) => void` | - | React |
| bind:change | 值变化事件 | `event.detail.value: number` | - | Mini |

## 平台差异

- 组件通过 `sr-field` 承载布局与辅助文案。
- 使用 `bind:change` 监听值变化。
- 内部输入框同样在 `blur` 时进行步进对齐。
