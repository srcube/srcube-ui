# Picker

基于 `Field + Drawer(bottom) + Pickbox` 组合实现的选择器，支持 React / Mini 双端，支持单选、多列选择，以及 `DatePicker`（1900~2099）。

## 使用

### React

```tsx
import { DatePicker, Picker } from '@srcube-ui/picker';
import { useMemo, useState } from 'react';

export default function Demo() {
  const [singleValue, setSingleValue] = useState<string | number | null>(null);
  const [dateValue, setDateValue] = useState<string | null>('2026-02-13');

  const cityItems = useMemo(
    () => [
      { id: 'cq', label: '重庆' },
      { id: 'cd', label: '成都' },
      { id: 'sh', label: '上海' },
    ],
    [],
  );

  return (
    <>
      <Picker
        label="城市"
        mode="single"
        items={cityItems}
        value={singleValue}
        onValueChange={setSingleValue}
      />

      <DatePicker
        className="mt-4"
        label="日期"
        value={dateValue}
        onValueChange={setDateValue}
      />
    </>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-picker": "@srcube-ui/picker/index",
    "sr-date-picker": "@srcube-ui/picker/date-picker/index"
  }
}
```

```xml
<sr-picker
  label="城市"
  mode="single"
  items="{{cityItems}}"
  value="{{cityValue}}"
  bind:valuechange="handleCityChange"
/>

<sr-date-picker
  className="mt-3"
  label="日期"
  value="{{dateValue}}"
  bind:valuechange="handleDateChange"
/>
```

## API

### Picker

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| label | Field 标签 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` | 全平台 |
| value | 受控值 | `single: string \| number \| null`；`multiple: Array<string \| number \| null>` | - | 全平台 |
| defaultValue | 非受控初始值 | 同 `value` | 首个可选项 | 全平台 |
| mode | 选择模式 | `"single" \| "multiple"` | `"single"` | 全平台 |
| items | 单选项列表（`mode=single`） | `PickerItem[]` | `[]` | 全平台 |
| columns | 多列列表（`mode=multiple`） | `PickerColumn[]` | `[]` | 全平台 |
| type | 渲染类型 | `"default" \| "calendar"`（当前均走 Pickbox） | `"default"` | 全平台 |
| color | 主题色（同步到 Field / Pickbox / Confirm） | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| size | 尺寸（同步到 Field / Confirm） | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | Field 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| separator | 多列展示分隔符 | `string` | `" / "` | 全平台 |
| confirmText | 确认按钮文本 | React: `ReactNode`；Mini: `string` | `"确认"` | 全平台 |
| drawerTitle | Drawer 标题（不传时使用 `label`） | React: `ReactNode`；Mini: `string` | `label` | 全平台 |
| isOpen | 受控开关 | `boolean` | - | 全平台 |
| defaultOpen | 默认开关 | `boolean` | `false` | 全平台 |
| onOpenChange / bind:openchange | 开关变化 | React: `(isOpen) => void`；Mini: `event.detail.isOpen` | - | 全平台 |
| onCancel / bind:cancel | 取消（dismiss）回调 | React: `() => void`；Mini: `event` | - | 全平台 |
| onValueChange / bind:valuechange | 确认后提交值 | React: `(value) => void`；Mini: `event.detail.value` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 面板内临时值变化 | React: `(value, detail) => void`；Mini: `event.detail` | - | 全平台 |
| isDismissable | 点击遮罩是否可关闭 | `boolean` | `true` | 全平台 |
| hasBackdrop | 是否显示遮罩 | `boolean` | `true` | 全平台 |
| backdrop | 遮罩样式 | `"transparent" \| "opaque" \| "blur"` | `"opaque"` | 全平台 |
| estimateSize | Pickbox 单项预估高度 | `number` | `44` | 全平台 |
| overscan | Pickbox 虚拟缓冲数量 | `number` | `5` | 全平台 |
| indicatorHeight | Pickbox 指示器高度 | `number` | `44` | 全平台 |
| scrollEndDelay | Pickbox 滚动结束判定延迟（ms） | `number` | `120` | 全平台 |
| classNames | slots 样式映射 | React: `PickerReactClassNames`；Mini: `PickerMiniClassNames` | - | 全平台 |
| className | 根节点样式 | `string` | `""` | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

### DatePicker

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 受控日期值（`YYYY-MM-DD`） | `string \| null` | - | 全平台 |
| defaultValue | 非受控初始日期（`YYYY-MM-DD`） | `string \| null` | - | 全平台 |
| minYear | 最小年份 | `number` | `1900` | 全平台 |
| maxYear | 最大年份 | `number` | `2099` | 全平台 |
| onValueChange / bind:valuechange | 日期确认回调 | React: `(value, detail) => void`；Mini: `event.detail.value` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 日期草稿变化 | React: `(value, detail) => void`；Mini: `event.detail.value` | - | 全平台 |
| 其它 Picker 公共字段 | 继承 `Picker`（除 `mode/items/columns`） | - | - | 全平台 |

## 行为说明

- 面板结构固定为：`Field` 触发 + `Drawer(bottom)` 承载 + `Pickbox` 选择 + `Confirm` 提交。
- `dismiss`（点击遮罩 / 手势关闭）不会提交草稿值，会回滚到上次确认值。
- `Confirm` 为 `solid + block`，并同步 `Field` 的 `color/size`。
- `DatePicker` 默认生成年/月/日三列，并按年月动态修正当月天数。

## 平台差异

### React

- `label/placeholder/confirmText/drawerTitle` 支持 `ReactNode`。
- `onDraftValueChange` 额外返回 `detail.values`（多列数组）与变更索引信息。

### Mini

- 文本型字段为 `string`。
- 通过事件传递结果：`bind:valuechange`（确认值）、`bind:draftvaluechange`（草稿值）、`bind:cancel`（取消）。
- 组件组合遵循 Mini 节点约定：子组件节点样式通过 `$xxx` slots 挂载在子组件本身。
