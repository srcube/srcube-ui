# Cascader

级联选择器，基于 `Picker` 复用交互能力（Field 触发 + Drawer + Pickbox），用于多级树形选项选择。

- React / Mini 双端实现
- 支持受控 / 非受控（`value` / `defaultValue`）
- 默认自动补齐每一级首个可选项
- 支持 `draft`（面板内临时值）与 `confirm`（确认值）分离

## 使用

### React

```tsx
import { Cascader } from '@srcube-ui/cascader';
import { useState } from 'react';

const options = [
  {
    id: 'zj',
    label: '浙江',
    children: [
      {
        id: 'hz',
        label: '杭州',
        children: [
          { id: 'xh', label: '西湖区' },
          { id: 'yh', label: '余杭区' },
        ],
      },
      {
        id: 'nb',
        label: '宁波',
        children: [{ id: 'jb', label: '江北区' }],
      },
    ],
  },
];

export default function Demo() {
  const [value, setValue] = useState<Array<string | null>>(['zj', 'hz', 'xh']);

  return (
    <Cascader
      label="地区"
      options={options}
      value={value}
      onValueChange={(next) => {
        setValue(next as Array<string | null>);
      }}
    />
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-cascader": "@srcube-ui/cascader/index"
  }
}
```

```xml
<sr-cascader
  label="地区"
  options="{{options}}"
  value="{{value}}"
  bind:valuechange="handleValueChange"
/>
```

## API

### Option

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 选项唯一标识 | `string \| number` | - |
| label | 选项文案 | `string` | `""` |
| isDisabled | 是否禁用 | `boolean` | `false` |
| children | 子级选项 | `CascaderOption[]` | `[]` |

### Props

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| options | 级联树选项 | `CascaderOption[]` | `[]` | 全平台 |
| value | 受控值（每级一个 id） | `Array<string \| number \| null>` | - | 全平台 |
| defaultValue | 非受控初始值 | `Array<string \| number \| null>` | 自动补齐首个可选项 | 全平台 |
| label | Field 标签 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` | 全平台 |
| placeholder | 占位文案 | React: `ReactNode`；Mini: `string` | `"请选择"` | 全平台 |
| description | 辅助文案 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| errorMessage | 错误文案 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| color | 主题色 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| variant | Field 样式 | `"outline" \| "twotone" \| "underline"` | `"outline"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| isDisabled | 禁用 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读 | `boolean` | `false` | 全平台 |
| isInvalid | 错误态 | `boolean` | `false` | 全平台 |
| isRequired | 必填态 | `boolean` | `false` | 全平台 |
| isLoading | 加载态 | `boolean` | `false` | 全平台 |
| isOpen | 受控开关 | `boolean` | - | 全平台 |
| defaultOpen | 默认开关 | `boolean` | `false` | 全平台 |
| confirmText | 确认按钮文案 | React: `ReactNode`；Mini: `string` | `"确认"` | 全平台 |
| drawerTitle | 抽屉标题（默认跟随 label） | React: `ReactNode`；Mini: `string` | `label` | 全平台 |
| isDismissable | 点击遮罩是否关闭 | `boolean` | `true` | 全平台 |
| hasBackdrop | 是否显示遮罩 | `boolean` | `true` | 全平台 |
| backdrop | 遮罩样式 | `"transparent" \| "opaque" \| "blur"` | `"opaque"` | 全平台 |
| separator | 展示分隔符 | `string` | `" / "` | 全平台 |
| estimateSize | Pickbox 单项预估高度 | `number` | `44` | 全平台 |
| overscan | Pickbox 虚拟缓冲 | `number` | `5` | 全平台 |
| indicatorHeight | Pickbox 指示器高度 | `number` | `44` | 全平台 |
| scrollEndDelay | Pickbox 滚动结束延迟 | `number` | `120`(React) / `180`(Mini) | 全平台 |
| className | 根节点样式 | `string` | `""` | 全平台 |
| classNames | slots 样式映射（`base/$picker/picker`） | React: `CascaderReactClassNames`；Mini: `CascaderMiniClassNames` | - | 全平台 |
| pickerClassNames | 透传给内部 Picker 的 slots 样式 | `PickerClassNames` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| onOpenChange / bind:openchange | 开关变化 | React: `(isOpen) => void`；Mini: `event.detail.isOpen` | - | 全平台 |
| onCancel / bind:cancel | 取消回调 | React: `() => void`；Mini: `event.detail` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 草稿值变化 | React: `(value, detail) => void`；Mini: `event.detail` | - | 全平台 |
| onValueChange / bind:valuechange | 确认值变化 | React: `(value, detail) => void`；Mini: `event.detail` | - | 全平台 |

## 回调 detail

- `value`: 当前级联路径值
- `labels`: 当前路径文案数组
- `options`: 当前路径完整 option 数组
- `columnIndex`（仅 draft）: 本次变化列索引
- `optionId`（仅 draft）: 本次变化选项 id

## 平台差异

### React

- `label` / `placeholder` / `description` / `errorMessage` / `confirmText` / `drawerTitle` 支持 `ReactNode`。
- `classNames` 不包含 Mini 专用 `$picker` slot。

### Mini

- 文本型字段均为 `string`。
- 通过事件回传数据：`bind:draftvaluechange`、`bind:valuechange`、`bind:openchange`、`bind:cancel`。
- 组件组合遵循 Mini 节点约定，子组件节点样式通过 `$picker` slot 挂载。
