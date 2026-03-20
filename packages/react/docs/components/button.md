# Button

React 按钮组件，基于 React Aria Components 实现。

## 使用

```tsx
import { Button, ButtonGroup } from "@srcube-ui/react";

export default function Demo() {
  return (
    <ButtonGroup>
      <Button>确定</Button>
      <Button variant="outline">取消</Button>
    </ButtonGroup>
  );
}
```

## API

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| tone | 明暗主题 | `"light" \| "dark"` | `"light"` |
| variant | 视觉风格 | `"solid" \| "outline" \| "flat" \| "text"` | `"solid"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| isBlock | 块级按钮（占满容器） | `boolean` | `false` |
| isIcon | 是否为纯图标按钮 | `boolean` | `false` |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| onTap | 点击事件 | `(event) => void \| Promise<void>` | - |
| classNames | slots 样式映射 | `ButtonClasses` | - |
| className | 根节点 class | `string \| ((state) => string)` | - |
| style | 内联样式 | `CSSProperties` | - |

## ButtonGroup

- ButtonGroup 会向子按钮注入 `color/tone/variant/size/radius/isBlock/isDisabled` 的默认值
- 子按钮显式传值时会覆盖 Group 的默认值
- `isBlock` 会让 Group 宽度占满，同时子按钮在组内等分宽度
- `orientation` 支持 `"x" | "y"`，用于横向/纵向排列按钮组（默认 `"x"`）

## 特性

- `color="default"` 为中性色按钮语义
- `tone="dark"` 适用于暗色主题场景，语义色会整体加深一档
- 使用 React Aria Components（RAC）提供无障碍支持
- `className` 支持函数式写法：`(state) => string`，`state` 来自 RAC（如 `isPressed/isHovered`）
- `onTap` 若返回 `Promise` 且 `isLoading="auto"`，会自动进入 loading 状态

## Slots

组件对外仅公开 `base` slot，可通过 `classNames.base` 自定义样式。
