# Radio

React 单选组件，基于 React Aria Components 实现。

## 使用

```tsx
import { Radio, RadioGroup } from "@srcube-ui/react";

export default function Demo() {
  return (
    <RadioGroup value="a" onValueChange={(value) => console.log(value)}>
      <Radio value="a">选项 A</Radio>
      <Radio value="b">选项 B</Radio>
    </RadioGroup>
  );
}
```

## API

### Radio

| Prop            | 说明                                | 类型                                                                          | 默认值      |
| --------------- | ----------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| value           | 当前值                              | `string`                                                                      | `""`        |
| color           | 颜色主题                            | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| tone            | 明暗主题                            | `"default" \| "dark"`                                                         | `"default"` |
| size            | 尺寸                                | `"sm" \| "md" \| "lg"`                                                        | `"md"`      |
| isSelected      | 选中态（独立使用时）                | `boolean`                                                                     | `false`     |
| defaultSelected | 默认选中（独立使用时）              | `boolean`                                                                     | `false`     |
| isLoading       | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"`                                                           | `false`     |
| isDisabled      | 禁用态                              | `boolean`                                                                     | `false`     |
| isReadOnly      | 只读态                              | `boolean`                                                                     | `false`     |
| onTap           | 点击事件                            | `(event) => void \| Promise<void>`                                            | -           |
| icon            | 自定义图标（可传渲染函数）          | `ReactNode \| ((state) => ReactNode)`                                         | -           |
| onValueChange   | 选中变化（独立使用时）              | `(isSelected: boolean) => void`                                               | -           |
| classNames      | slots 样式映射                      | `RadioClasses`                                                                | -           |
| className       | 根节点 class                        | `string \| ((state) => string)`                                               | -           |
| style           | 内联样式                            | `CSSProperties`                                                               | -           |

### RadioGroup

| Prop          | 说明         | 类型                            | 默认值  |
| ------------- | ------------ | ------------------------------- | ------- |
| value         | 受控值       | `string \| null`                | -       |
| defaultValue  | 默认值       | `string \| null`                | -       |
| onValueChange | 选中值变化   | `(value: string) => void`       | -       |
| orientation   | 排列方向     | `"x" \| "y"`                    | `"y"`   |
| isBlock       | 宽度占满父级 | `boolean`                       | `false` |
| color         | 默认颜色     | `Radio['color']`                | -       |
| tone          | 默认明暗主题 | `Radio['tone']`                 | -       |
| size          | 默认尺寸     | `Radio['size']`                 | -       |
| isDisabled    | 禁用态       | `boolean`                       | `false` |
| isReadOnly    | 只读态       | `boolean`                       | `false` |
| className     | 根节点 class | `string \| ((state) => string)` | -       |
| style         | 内联样式     | `CSSProperties`                 | -       |

## 特性

- 使用 React Aria Components（RAC）提供无障碍支持
- `className` 支持函数式写法：`(state) => string`
- `onTap` 若返回 `Promise` 且 `isLoading="auto"`，会自动进入 loading 状态
