# Picker

基于 `Field + Drawer(bottom) + Pickbox` 组合实现的选择器，支持 React / Mini 双端，支持一列与级联多列（`options`），以及 `PickerDatetime` / `PickerDatetimeRange`。多选场景使用 `PickerSelect`（`Selectbox`）。

## 使用

### API

### Picker

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| label | Field 标签 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` | 全平台 |
| value | 受控值（始终数组） | `Array<string \| number \| null>` | - | 全平台 |
| defaultValue | 非受控初始值（始终数组） | `Array<string \| number \| null>` | - | 全平台 |
| isClearable | 是否显示清空按钮（已有提交值时显示） | `boolean` | `false` | 全平台 |
| items | 一列列表（不传 `columns` 时生效） | `PickerItem[]` | `[]` | 全平台 |
| columns | 固定多列列表（兼容模式） | `PickerColumn[]` | `[]` | 全平台 |
| options | 级联多列选项（`Cascader` 效果，优先级高于 `columns/items`） | `PickerOption[]` | `[]` | 全平台 |
| type | 渲染类型 | `"default" \| "calendar"`（当前均走 Pickbox） | `"default"` | 全平台 |
| color | 主题色（同步到 Field / Pickbox / Confirm） | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| size | 尺寸（同步到 Field / Drawer title / Pickbox / Selectbox / Confirm） | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | Field 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| separator | 多列展示分隔符 | `string` | `" / "` | 全平台 |
| confirmText | 确认按钮文本 | React: `ReactNode`；Mini: `string` | `"确认"` | 全平台 |
| drawerTitle | Drawer 标题（不传时使用 `label`） | React: `ReactNode`；Mini: `string` | `label` | 全平台 |
| isOpen | 受控开关 | `boolean` | - | 全平台 |
| defaultOpen | 默认开关 | `boolean` | `false` | 全平台 |
| onOpenChange / bind:openchange | 开关变化 | React: `(isOpen) => void`；Mini: `event.detail.isOpen` | - | 全平台 |
| onClear / bind:clear | 点击清空按钮 | React: `() => void`；Mini: `event.detail.value` | - | 全平台 |
| onCancel / bind:cancel | 取消（dismiss）回调 | React: `() => void`；Mini: `event` | - | 全平台 |
| onValueChange / bind:valuechange | 确认后提交值 | React: `(value: Array<...>) => void`；Mini: `event.detail.value` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 面板内临时值变化 | React: `(value: Array<...>, detail) => void`；Mini: `event.detail` | - | 全平台 |
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

### PickerSelect

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| items | 可选项列表 | React: `PickerSelectItem[]`；Mini: `PickerSelectMiniItem[]` | `[]` | 全平台 |
| value | 受控值 | `Array<string \| number>` | - | 全平台 |
| defaultValue | 非受控初始值 | `Array<string \| number>` | `[]` | 全平台 |
| selectionMode | 选择模式 | `"single" \| "multiple"` | `"multiple"` | 全平台 |
| onValueChange / bind:valuechange | Confirm 提交值 | React: `(value) => void`；Mini: `event.detail.value` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 面板草稿值变化 | React: `(value, detail) => void`；Mini: `event.detail` | - | 全平台 |
| 其它 Picker 公共字段 | 继承 `Picker`（除 `items/columns/options/isClearable/value/defaultValue/onClear/onValueChange/onDraftValueChange`） | - | - | 全平台 |

### PickerDatetime

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| mode | 选择范围 | `"datetime" \| "date" \| "time"` | `"datetime"` | 全平台 |
| format | 值格式（支持 `YYYY/MM/DD/HH/mm/ss`） | `string` | `mode` 对应默认格式 | 全平台 |
| value | 受控值 | `string \| null` | - | 全平台 |
| defaultValue | 非受控初始值 | `string \| null` | - | 全平台 |
| minYear | 最小年份（涉及日期时生效） | `number` | `1900` | 全平台 |
| maxYear | 最大年份（涉及日期时生效） | `number` | `2099` | 全平台 |
| dateTabText | 日期面板 Tab 文案 | React: `ReactNode`；Mini: `string` | `"日期"` | 全平台 |
| timeTabText | 时间面板 Tab 文案 | React: `ReactNode`；Mini: `string` | `"时间"` | 全平台 |
| onValueChange / bind:valuechange | 确认值变化 | React: `(value, detail) => void`；Mini: `event.detail.value` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 草稿值变化 | React: `(value, detail) => void`；Mini: `event.detail.value` | - | 全平台 |
| 其它 Picker 公共字段 | 继承 `Picker`（除 `items/columns/isClearable/value/defaultValue/onClear/onValueChange/onDraftValueChange`） | - | - | 全平台 |

### PickerDatetimeRange

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| mode | 选择范围 | `"datetime" \| "date" \| "time"` | `"datetime"` | 全平台 |
| format | 值格式（支持 `YYYY/MM/DD/HH/mm/ss`） | `string` | `mode` 对应默认格式 | 全平台 |
| value | 受控区间值 | `{ start: string \| null; end: string \| null }` | - | 全平台 |
| defaultValue | 非受控初始区间 | `{ start: string \| null; end: string \| null }` | - | 全平台 |
| minYear | 最小年份（涉及日期时生效） | `number` | `1900` | 全平台 |
| maxYear | 最大年份（涉及日期时生效） | `number` | `2099` | 全平台 |
| startTabText | 开始 Tab 文案 | React: `ReactNode`；Mini: `string` | `"开始"` | 全平台 |
| endTabText | 结束 Tab 文案 | React: `ReactNode`；Mini: `string` | `"结束"` | 全平台 |
| dateTabText | 日期面板 Tab 文案 | React: `ReactNode`；Mini: `string` | `"日期"` | 全平台 |
| timeTabText | 时间面板 Tab 文案 | React: `ReactNode`；Mini: `string` | `"时间"` | 全平台 |
| valueSeparator | Field 展示分隔符 | `string` | `" ~ "` | 全平台 |
| onValueChange / bind:valuechange | 确认区间变化 | React: `(value, detail) => void`；Mini: `event.detail.value` | - | 全平台 |
| onDraftValueChange / bind:draftvaluechange | 草稿区间变化 | React: `(value, detail) => void`；Mini: `event.detail.value` | - | 全平台 |
| 其它 Picker 公共字段 | 继承 `Picker`（除 `items/columns/isClearable/value/defaultValue/onClear/onValueChange/onDraftValueChange`） | - | - | 全平台 |

## 行为说明

- 面板结构固定为：`Field` 触发 + `Drawer(bottom)` 承载 + `Pickbox` 选择 + `Confirm` 提交。
- `Picker` 本身不是多选组件；多选请使用 `PickerSelect`。
- 未传 `value/defaultValue` 时，`Field` 保持 placeholder；打开面板后 `Pickbox` 内部会默认定位到首个可选项，只有确认后才提交到 `Field`。
- `dismiss`（点击遮罩 / 手势关闭）不会提交草稿值，会回滚到上次确认值。
- `Confirm` 为 `flat + block`，并同步 `Field` 的 `color/size`。
- `size` 会同步影响 Drawer 标题字号，以及面板内部 `Pickbox / Selectbox` 与 Footer 按钮。
- `Picker` 的值始终按数组读写；一列场景返回长度为 1 的数组。
- `Picker` 传入 `options` 时按级联规则生成多列：上一列变化会重建下一列可选项。
- `PickerDatetime` 与 `PickerDatetimeRange` 的 `mode=datetime` 会在 Drawer 内展示全宽 Date/Time 切换；`mode=date/time` 不展示切换。
- `PickerDatetime` 与 `PickerDatetimeRange` 支持 `format` 读写值（默认：`datetime=YYYY-MM-DD HH:mm:ss`、`date=YYYY-MM-DD`、`time=HH:mm:ss`）。

## 平台差异

- 文本型字段为 `string`。
- 通过事件传递结果：`bind:valuechange`（确认值）、`bind:draftvaluechange`（草稿值）、`bind:cancel`（取消）。
- 组件组合遵循 Mini 节点约定：子组件节点样式通过 `$xxx` slots 挂载在子组件本身。
