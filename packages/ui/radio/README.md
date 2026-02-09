# Radio

移动端单选组件，React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### React

```tsx
import { Radio, RadioGroup } from "@srcube-ui/radio";

export default function Demo() {
  return (
    <RadioGroup value="a" onValueChange={(value) => console.log(value)}>
      <Radio value="a">选项 A</Radio>
      <Radio value="b">选项 B</Radio>
    </RadioGroup>
  );
}
```

### Mini

支持使用 `slot="icon"` 自定义图标。

```json
{
  "usingComponents": {
    "sr-radio": "@srcube-ui/radio/mini",
    "sr-radio-group": "@srcube-ui/radio/mini/radio-group"
  }
}
```

```xml
<sr-radio-group value="{{value}}" bind:change="onChange">
  <sr-radio value="a">选项 A</sr-radio>
  <sr-radio value="b">选项 B</sr-radio>
</sr-radio-group>
```

> Mini 端组件本身就是外层节点，布局样式需要显式给组件本身设置；
> 如果需要等分宽度，请给组件自身加 `class`。

## API

### Radio

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 当前值 | `string` | `""` | 全平台 |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| isSelected | 选中态（独立使用时） | `boolean` | `false` | 全平台 |
| defaultSelected | 默认选中（独立使用时） | `boolean` | `false` | 全平台 |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读态 | `boolean` | `false` | 全平台 |
| hasIcon | 是否使用 icon slot（Mini） | `boolean` | `false` | Mini |
| onTap | 点击事件 | `(event) => void \| Promise<void>` | - | 全平台 |
| icon | 自定义图标（React 可传渲染函数） | `ReactNode \| ((state) => ReactNode)` | - | React |
| onValueChange | 选中变化（独立使用时） | `(isSelected: boolean) => void` | - | 全平台 |
| classNames | slots 样式映射 | `VariantClasses` | - | 全平台 |
| className | 根节点 class | React: `string \| ((state) => string)`；Mini: `string` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

### RadioGroup

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 受控值 | `string \| null` | - | 全平台 |
| defaultValue | 默认值 | `string \| null` | - | 全平台 |
| onValueChange | 选中值变化 | `(value: string) => void` | - | 全平台 |
| orientation | 排列方向 | `"y" \| "x"` | `"y"` | 全平台 |
| isBlock | 宽度占满父级 | `boolean` | `false` | 全平台 |
| color | 默认颜色 | `Radio['color']` | - | 全平台 |
| size | 默认尺寸 | `Radio['size']` | - | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读态 | `boolean` | `false` | 全平台 |
| className | 根节点 class | React: `string \| ((state) => string)`；Mini: `string` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 平台差异

### React

- 使用 React Aria Components（RAC）。
- `className` 支持函数式写法：`(state) => string`，`state` 来自 RAC（如 `isPressed/isHovered`）。
- `onTap` 若返回 `Promise` 且 `isLoading="auto"`，会自动进入 loading 状态。

### Mini

- `className` 仅支持 `string`。
- 支持 `slot="icon"` 自定义图标（适合 Iconify 类名），需要同时设置 `hasIcon`。
- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading。
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）。
