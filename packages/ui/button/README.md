# Button

移动端按钮组件，React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### React

```tsx
import { Button, ButtonGroup } from "@srcube-ui/button";

export default function Demo() {
  return (
    <ButtonGroup>
      <Button>确定</Button>
      <Button variant="outline">取消</Button>
    </ButtonGroup>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-button": "@srcube-ui/button/mini",
    "sr-button-group": "@srcube-ui/button/mini/button-group"
  }
}
```

```xml
<sr-button-group>
  <sr-button>确定</sr-button>
  <sr-button variant="outline">取消</sr-button>
</sr-button-group>
```

> Mini 端组件本身就是外层节点，布局样式需要显式给组件本身设置；
> 如果想在 Group 内做到与 Web 相同的等分宽度，请给组件自身加 `class`：
>
> ```xml
> <sr-button-group>
>   <sr-button class="flex-1">Yes</sr-button>
>   <sr-button variant="outline" class="flex-1">No</sr-button>
> </sr-button-group>
> ```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"primary"` | 全平台 |
| variant | 视觉风格 | `"solid" \| "outline" \| "flat" \| "text"` | `"solid"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| isBlock | 块级按钮（占满容器） | `boolean` | `false` | 全平台 |
| isIcon | 是否为纯图标按钮 | `boolean` | `false` | 全平台 |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| onTap | 点击事件 | `(event) => void \| Promise<void>` | - | 全平台 |
| classNames | slots 样式映射 | `VariantClasses` | - | 全平台 |
| className | 根节点 class | React: `string \| ((state) => string)`；Mini: `string` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| buttonId | 原生 button id | `string` | - | Mini |
| formType | 原生 formType | `string` | - | Mini |
| openType | 原生 openType | `string` | - | Mini |
| hoverClass | 原生 hoverClass | `string` | `"none"` | Mini |
| hoverStopPropagation | 原生 hoverStopPropagation | `boolean` | - | Mini |
| hoverStartTime | 原生 hoverStartTime | `number` | - | Mini |
| hoverStayTime | 原生 hoverStayTime | `number` | - | Mini |
| lang | 原生 lang | `string` | - | Mini |
| sessionFrom | 原生 sessionFrom | `string` | - | Mini |
| sendMessageTitle | 原生 sendMessageTitle | `string` | - | Mini |
| sendMessagePath | 原生 sendMessagePath | `string` | - | Mini |
| sendMessageImg | 原生 sendMessageImg | `string` | - | Mini |
| showMessageCard | 原生 showMessageCard | `boolean` | - | Mini |
| appParameter | 原生 appParameter | `string` | - | Mini |
| phoneNumberNoQuotaToast | 原生 phoneNumberNoQuotaToast | `boolean` | - | Mini |
| needShowEntrance | 原生 needShowEntrance | `boolean` | - | Mini |
| entrancePath | 原生 entrancePath | `string` | - | Mini |
| ariaLabel | 无障碍 label | `string` | - | Mini |

## ButtonGroup

- ButtonGroup 会向子按钮注入 `color/variant/size/radius/isBlock/isDisabled` 的默认值。
- 子按钮显式传值时会覆盖 Group 的默认值。
- `isBlock` 会让 Group 宽度占满，同时子按钮在组内等分宽度。

## 平台差异

### React

- 使用 React Aria Components（RAC）。
- `className` 支持函数式写法：`(state) => string`，`state` 来自 RAC（如 `isPressed/isHovered`）。
- `onTap` 若返回 `Promise` 且 `isLoading="auto"`，会自动进入 loading 状态。

### Mini

- `className` 仅支持 `string`。
- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading。
- 原生 button 事件由内部隐形 button 承载，外层 view 只负责样式。
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）。
