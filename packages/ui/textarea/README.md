# Textarea

基于 `Field` 的多行输入组件：继承 Field 的统一表单容器能力，并默认启用多行布局。

## 使用

### React

```tsx
import { Textarea } from '@srcube-ui/textarea';
import { useState } from 'react';

export default function Demo() {
  const [bio, setBio] = useState('');

  return (
    <Textarea
      label="简介"
      placeholder="请输入内容"
      value={bio}
      onValueChange={setBio}
      isClearable
      showCount
      rows={4}
    />
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-textarea": "@srcube-ui/textarea/index"
  }
}
```

```xml
<sr-textarea
  label="简介"
  value="{{bio}}"
  placeholder="请输入内容"
  showCount
  rows="4"
  isClearable
  bind:valuechange="handleBioValueChange"
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
| rows | 文本区域初始行数 | `number` | `3` | 全平台 |
| maxLength | 最大输入长度（Mini 传 `-1` 表示无限） | `number` | React: 浏览器默认；Mini: `200` | 全平台 |
| isAutoHeight | 是否自动增高 | `boolean` | `false` | 全平台 |
| showCount | 是否展示右下角计数（`count/maxCount`） | `boolean` | `false` | 全平台 |
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
| textareaClassName | 文本域 class | `string` | - | 全平台 |
| onValueChange / bind:valuechange | 值变化回调 | React: `(value: string) => void`；Mini: `bind:valuechange` (`detail.value`) | - | 全平台 |
| onClear / bind:clear | 清空回调 | React: `() => void`；Mini: `bind:clear` (`detail.value`) | - | 全平台 |
| onTap / bind:tap | 容器点击回调 | React: `(event) => void`；Mini: `bind:tap` | - | 全平台 |

## 平台差异

### React

- 透传原生 `textarea` 属性（如 `maxLength` 等）。
- `isAutoHeight` 为 `true` 时，输入后按内容高度自动扩展。
- `showCount` 开启时，若 `maxLength` 未设置（浏览器默认 `-1`）则渲染 `♾️`。

### Mini

- 使用原生 `textarea`，支持 `maxLength/isConfirmHold` 等小程序属性。
- `isAutoHeight` 为 `true` 时走原生 `auto-height`。
- `showCount` 开启时，`maxLength=-1` 会渲染为 `♾️`。
