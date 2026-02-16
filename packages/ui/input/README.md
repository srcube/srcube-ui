# Input

基于 `Field` 的单行输入组件：复用统一的标签、描述/错误、前后缀与清空能力。

## 使用

### React

```tsx
import { Input } from '@srcube-ui/input';
import { useState } from 'react';

export default function Demo() {
  const [phone, setPhone] = useState('');

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

### Mini

```json
{
  "usingComponents": {
    "sr-input": "@srcube-ui/input/index"
  }
}
```

```xml
<sr-input
  label="手机号"
  value="{{phone}}"
  placeholder="请输入手机号"
  isClearable
  bind:valuechange="handlePhoneValueChange"
/>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| id | 控件 id（用于 label 关联） | `string` | 自动生成 | 全平台 |
| label | 标签内容 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` | 全平台 |
| value | 受控值 | `string \| number` | - | 全平台 |
| defaultValue | 非受控初始值 | `string \| number` | `""` | 全平台 |
| placeholder | 占位内容 | `string` | - | 全平台 |
| description | 描述文本（无错误时显示） | React: `ReactNode`；Mini: `string` | - | 全平台 |
| errorMessage | 错误文本（优先于 description） | React: `ReactNode`；Mini: `string` | - | 全平台 |
| isClearable | 是否显示清空按钮（有值时显示） | `boolean` | `false` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读态 | `boolean` | `false` | 全平台 |
| isInvalid | 错误态 | `boolean` | `false` | 全平台 |
| isRequired | 必填态（仅显示星号） | `boolean` | `false` | 全平台 |
| isLoading | 加载态（仅视觉态） | `boolean` | `false` | 全平台 |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| className | 根节点 class | `string` | - | 全平台 |
| classNames | Field slots 样式映射 | `FieldClassNames` | - | 全平台 |
| inputClassName | 输入框 class | `string` | - | 全平台 |
| onValueChange / bind:valuechange | 值变化回调 | React: `(value: string) => void`；Mini: `bind:valuechange` (`detail.value`) | - | 全平台 |
| onClear / bind:clear | 清空回调 | React: `() => void`；Mini: `bind:clear` (`detail.value`) | - | 全平台 |
| onTap / bind:tap | 容器点击回调 | React: `(event) => void`；Mini: `bind:tap` | - | 全平台 |

## 平台差异

### React

- 透传原生 `input` 属性（如 `type/maxLength/autoComplete` 等）。

### Mini

- 透传小程序 `input` 常用属性：`inputType/maxLength/confirmType/isPassword/isConfirmHold/isAlwaysEmbed`。
- 前后缀使用 `start/end` slot，需配合 `hasStartContent/hasEndContent`。
