# Field

React 表单控件容器，统一 label、描述/错误提示、前后缀与清空按钮视觉结构。

## 使用

```tsx
import { Field } from "@srcube-ui/react";
import { useState } from "react";

export default function Demo() {
  const [phone, setPhone] = useState("");

  return (
    <Field
      label="手机号"
      description="支持中国大陆手机号"
      value={phone}
      onValueChange={setPhone}
      isClearable
      endContent={<span className="icon-phone" />}
      onClear={() => {
        console.log("clear");
      }}
    >
      {({ id, className, value, onValueChange }) => (
        <input
          id={id}
          className={className}
          value={value}
          placeholder="请输入手机号"
          onChange={(event) => {
            onValueChange(event.target.value);
          }}
        />
      )}
    </Field>
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
| placeholder | 占位内容 | `ReactNode` | - |
| description | 描述文本 | `ReactNode` | - |
| errorMessage | 错误文本（优先于 description） | `ReactNode` | - |
| startContent | 控件起始内容 | `ReactNode` | - |
| endContent | 控件结束内容 | `ReactNode` | - |
| clearButton | 清空按钮内容 | `ReactNode` | 默认清空图标 |
| isClearable | 是否显示清空按钮 | `boolean` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| isInvalid | 错误态 | `boolean` | `false` |
| isRequired | 必填态（仅显示星号） | `boolean` | `false` |
| isLoading | 加载态（仅视觉态） | `boolean` | `false` |
| isMultiline | 多行内容布局 | `boolean` | `false` |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| classNames | slot 样式映射 | `FieldClassNames` | - |
| className | 根节点 class | `string` | - |
| style | 根节点内联样式 | `CSSProperties` | - |
| children | 自定义控件区域 | `ReactNode \| (args) => ReactNode` | - |
| controlProps | 控件容器属性 | `HTMLAttributes<HTMLDivElement>` | - |
| onValueChange | 值变化回调 | `(value: string) => void` | - |
| onTap | 容器点击回调 | `(event) => void` | - |
| onClear | 清空回调 | `() => void` | - |

## 特性

- `children` 支持函数式渲染，自动注入 `{ id, className, value, onValueChange, isDisabled, isReadOnly, isInvalid }`
