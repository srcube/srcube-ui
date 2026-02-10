# Switch

移动端开关组件，React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### React

```tsx
import { Switch } from "@srcube-ui/switch";

export default function Demo() {
  return (
    <Switch defaultSelected onValueChange={(next) => console.log(next)}>
      消息通知
    </Switch>
  );
}
```

### Mini

支持使用 `slot="icon"` 自定义 thumb 图标。

```json
{
  "usingComponents": {
    "sr-switch": "@srcube-ui/switch/index"
  }
}
```

```xml
<sr-switch defaultSelected bind:change="onChange">消息通知</sr-switch>
```

> Mini 端组件本身就是外层节点，布局样式需要显式给组件本身设置；
> 如果需要等分宽度，请给组件自身加 `class`。

## API

### Switch

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 当前值（随 change 事件透传） | `string` | `""` | 全平台 |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| isSelected | 受控选中态 | `boolean` | - | 全平台 |
| defaultSelected | 非受控默认选中 | `boolean` | `false` | 全平台 |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读态 | `boolean` | `false` | 全平台 |
| hasIcon | 是否使用 icon slot（Mini） | `boolean` | `false` | Mini |
| onTap | 点击事件 | React: `() => void \| Promise<void>`；Mini: `bind:tap` + `e.detail.wait(Promise)` | - | 全平台 |
| icon | 自定义 thumb 图标（React 可传渲染函数） | `ReactNode \| ((props) => ReactNode)` | - | React |
| onValueChange | 选中变化 | `(isSelected: boolean) => void` | - | 全平台 |
| classNames | slots 样式映射 | `VariantClasses` | - | 全平台 |
| className | 根节点 class | React: `string \| ((state) => string)`；Mini: `string` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 平台差异

### React

- 使用 React Aria Components（RAC）`Switch`。
- 默认不显示开启打勾图标；如需图标可通过 `icon` 自定义。
- `className` 支持函数式写法：`(state) => string`，`state` 来自 RAC（如 `isPressed/isHovered`）。
- `onTap` 若返回 `Promise` 且 `isLoading="auto"`，会自动进入 loading 状态。

### Mini

- `className` 仅支持 `string`。
- 默认不显示开启打勾图标；如需图标请设置 `hasIcon` 并使用 `slot="icon"`。
- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading。
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）。
