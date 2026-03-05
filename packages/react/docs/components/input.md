# Input

React 单行输入组件，基于 `Field`。

## 使用

```tsx
import { Input } from "@srcube-ui/react";
import { useState } from "react";

export default function Demo() {
  const [phone, setPhone] = useState("");

  return (
    <Input
      label="手机号"
      placeholder="请输入手机号"
      value={phone}
      onValueChange={setPhone}
      isClearable
      endContent={<span className="icon-phone" />}
    />
  );
}
```

## API

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 控件 id（用于 label 关联） | `string` | 自动生成 |
| label | 标签内容 | `ReactNode` | - |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` |
| value | 受控值 | `string \| number` | - |
| defaultValue | 非受控初始值 | `string \| number` | `""` |
| placeholder | 占位内容 | `string` | - |
| description | 描述文本（无错误时显示） | `ReactNode` | - |
| errorMessage | 错误文本（优先于 description） | `ReactNode` | - |
| isClearable | 是否显示清空按钮（有值时显示） | `boolean` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| isInvalid | 错误态 | `boolean` | `false` |
| isRequired | 必填态（仅显示星号） | `boolean` | `false` |
| isLoading | 加载态（仅视觉态） | `boolean` | `false` |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| className | 根节点 class | `string` | - |
| classNames | Field slots 样式映射 | `FieldClassNames` | - |
| inputClassName | 输入框 class | `string` | - |
| onValueChange | 值变化回调 | `(value: string) => void` | - |
| onClear | 清空回调 | `() => void` | - |
| onTap | 容器点击回调 | `(event) => void` | - |

## 特性

- 透传原生 `input` 属性（如 `type/maxLength/autoComplete` 等）
