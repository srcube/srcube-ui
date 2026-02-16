# Field

用于封装表单元素表现层的容器组件：统一 label、描述/错误提示、前后缀与清空按钮视觉结构。

## 使用

### React

```tsx
import { Field } from '@srcube-ui/field';
import { useState } from 'react';

export default function Demo() {
  const [phone, setPhone] = useState('');

  return (
    <Field
      label="手机号"
      description="支持中国大陆手机号"
      value={phone}
      onValueChange={setPhone}
      isClearable
      endContent={<span className="icon-phone" />}
      onClear={() => {
        console.log('clear');
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

### Mini

```json
{
  "usingComponents": {
    "sr-field": "@srcube-ui/field/index"
  }
}
```

```xml
<sr-field
  label="手机号"
  description="支持中国大陆手机号"
  value="{{phone}}"
  isClearable
  hasControl="{{true}}"
  hasEndContent
  bind:valuechange="handlePhoneValueChange"
  bind:clear="handleClear"
>
  <input
    slot=""
    id="phone-input"
    class="w-full"
    value="{{phone}}"
    placeholder="请输入手机号"
    bindinput="handlePhoneInput"
  />
  <view slot="end" class="icon-phone" />
</sr-field>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| id | 控件 id（用于 label 关联） | `string` | 自动生成 | 全平台 |
| label | 标签内容 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` | 全平台 |
| value | 受控值（用于清空按钮展示与 fallback 内容显示） | React: `string \| number`；Mini: `string \| number` | - | 全平台 |
| defaultValue | 非受控初始值 | React: `string \| number`；Mini: `string \| number` | `""` | 全平台 |
| placeholder | 占位内容（无 value 且无自定义 children/slot 时显示；Mini 需 `hasControl=false`） | React: `ReactNode`；Mini: `string` | - | 全平台 |
| description | 描述文本（无错误时显示） | React: `ReactNode`；Mini: `string` | - | 全平台 |
| errorMessage | 错误文本（优先于 description） | React: `ReactNode`；Mini: `string` | - | 全平台 |
| startContent | 控件起始内容 | `ReactNode` | - | React |
| endContent | 控件结束内容 | `ReactNode` | - | React |
| clearButton | 清空按钮内容 | `ReactNode` | 默认清空图标 | React |
| hasControl | 标记使用默认 slot 渲染控件（开启后不再渲染 fallback 文本） | `boolean` | `false` | Mini |
| hasStartContent | 启用 `start` 插槽容器 | `boolean` | `false` | Mini |
| hasEndContent | 启用 `end` 插槽容器 | `boolean` | `false` | Mini |
| hasClearContent | 启用 `clear` 插槽容器 | `boolean` | `false` | Mini |
| isClearable | 是否显示清空按钮 | `boolean` | `false` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读态 | `boolean` | `false` | 全平台 |
| isInvalid | 错误态 | `boolean` | `false` | 全平台 |
| isRequired | 必填态（仅显示星号） | `boolean` | `false` | 全平台 |
| isLoading | 加载态（仅视觉态） | `boolean` | `false` | 全平台 |
| isMultiline | 多行内容布局（start/end/clear 与首行对齐） | `boolean` | `false` | 全平台 |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| classNames | slot 样式映射 | `FieldClassNames` | - | 全平台 |
| className | 根节点 class | `string` | - | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| children / slot | 自定义控件区域 | React: `ReactNode \| (args) => ReactNode`；Mini: 默认 slot | - | 全平台 |
| controlProps | 控件容器属性 | `HTMLAttributes<HTMLDivElement>` | - | React |
| onValueChange / bind:valuechange | 值变化回调（clear 点击也会触发） | React: `(value: string) => void`；Mini: `bind:valuechange` (`detail.value`) | - | 全平台 |
| onTap / bind:tap | 容器点击回调 | React: `(event) => void`；Mini: `bind:tap` | - | 全平台 |
| onClear / bind:clear | 清空回调 | React: `() => void`；Mini: `bind:clear` (`detail.value`) | - | 全平台 |

## Mini 插槽

- 默认 slot：控件主体。
- `start`：前缀内容（需 `hasStartContent`）。
- `end`：后缀内容（需 `hasEndContent`）。
- `clear`：自定义清空按钮内容（需 `isClearable` + `hasClearContent`）。

## 平台差异

### React

- `children` 支持函数式渲染，自动注入 `{ id, className, value, onValueChange, isDisabled, isReadOnly, isInvalid }`。
- `startContent/endContent/clearButton` 可直接传入 `ReactNode`。

### Mini

- `className` 仅支持 `string`。
- 小程序组件本身就是一个节点，布局样式需加在组件自身（`className/style`）。
- 使用默认 slot 作为真实表单控件时，请设置 `hasControl`，避免 fallback 文本覆盖控件。
- 前后缀通过命名 slot 提供，需配合 `hasStartContent/hasEndContent` 启用对应容器。
- `bind:valuechange` 的 `detail.value` 为最新值；受控场景请同步更新 `value`。
