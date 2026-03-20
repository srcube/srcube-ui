# Switch

React 开关组件，基于 React Aria Components 实现。

## 使用

```tsx
import { Switch } from "@srcube-ui/react";

export default function Demo() {
  return (
    <Switch defaultSelected onValueChange={(next) => console.log(next)}>
      消息通知
    </Switch>
  );
}
```

## API

| Prop            | 说明                                | 类型                                                                          | 默认值      |
| --------------- | ----------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| value           | 当前值（随 change 事件透传）        | `string`                                                                      | `""`        |
| color           | 颜色主题                            | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| tone            | 明暗主题                            | `"default" \| "dark"`                                                         | `"default"` |
| size            | 尺寸                                | `"sm" \| "md" \| "lg"`                                                        | `"md"`      |
| isSelected      | 受控选中态                          | `boolean`                                                                     | -           |
| defaultSelected | 非受控默认选中                      | `boolean`                                                                     | `false`     |
| isLoading       | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"`                                                           | `false`     |
| isDisabled      | 禁用态                              | `boolean`                                                                     | `false`     |
| isReadOnly      | 只读态                              | `boolean`                                                                     | `false`     |
| onTap           | 点击事件                            | `() => void \| Promise<void>`                                                 | -           |
| icon            | 自定义 thumb 图标（可传渲染函数）   | `ReactNode \| ((props) => ReactNode)`                                         | -           |
| onValueChange   | 选中变化                            | `(isSelected: boolean) => void`                                               | -           |
| classNames      | slots 样式映射                      | `SwitchClassNames`                                                            | -           |
| className       | 根节点 class                        | `string \| ((state) => string)`                                               | -           |
| style           | 内联样式                            | `CSSProperties`                                                               | -           |

## 特性

- 使用 React Aria Components（RAC）`Switch`
- 默认不显示开启打勾图标；如需图标可通过 `icon` 自定义
- `className` 支持函数式写法：`(state) => string`
- `onTap` 若返回 `Promise` 且 `isLoading="auto"`，会自动进入 loading 状态
