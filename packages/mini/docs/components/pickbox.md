# Pickbox

多列滚动选择容器（React / Mini 双端独立实现），支持中心指示器对齐与滚动吸附。

## 使用

### API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| columns | 多列数据 | React: `PickboxColumn[]`；Mini: `PickboxMiniColumn[]` | `[]` | 全平台 |
| value | 受控值（按列） | React: `PickboxValue`；Mini: `PickboxMiniValue` | - | 全平台 |
| defaultValue | 非受控默认值（按列） | React: `PickboxValue`；Mini: `PickboxMiniValue` | 每列首个可选项 | 全平台 |
| onValueChange / bind:valuechange | 列值变化 | React: `(value) => void`；Mini: `event.detail.value` | - | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| estimateSize | 单项预估高度 | `number` | 随 `size`：`sm=36`、`md=44`、`lg=52` | 全平台 |
| overscan | 虚拟缓冲项数量 | `number` | `5` | 全平台 |
| color | 指示器色板 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| indicatorHeight | 指示器高度 | `number` | 跟随 `estimateSize` | 全平台 |
| scrollEndDelay | 滚动结束判定延迟（ms） | `number` | `120` | 全平台 |
| classNames | slots 样式映射 | React: `PickboxReactClassNames`；Mini: `PickboxMiniClassNames` | - | 全平台 |
| className | 根节点样式 | `string` | - | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| getItemKey | 自定义 item key | `(item, columnIndex, itemIndex) => string \| number` | `item.id` | React |
| renderItem | 自定义项渲染 | `(item, columnIndex, itemIndex, state) => ReactNode` | `item.label` | React |

## 行为说明

- 指示器固定在容器垂直中线。
- React 端使用 `@tanstack/virtual`；Mini 端使用滚动 + 绝对定位列表并在滚动结束后吸附。
- 指示器色板规则：
  - `default` 使用 `100` 级背景色；
  - 语义色（`primary/secondary/success/warning/danger`）使用 `50` 级背景色。
- 选中项文字规则：
  - `default` 为黑色（`text-slate-900`）；
  - 语义色跟随对应色（如 `primary -> text-primary`）。
- 每列虚拟 padding 统一为：
  - `paddingStart = containerHeight / 2 - indicatorHeight / 2`
  - `paddingEnd = containerHeight / 2 - indicatorHeight / 2`
- 初始渲染时，选中项（默认首个可选项）与指示器对齐。
- 通过滚动选择项；滚动结束后自动吸附到最近可选项。
- 手动滚动结束后，自动吸附到最近可选项并更新值。

## 平台差异

- `items[].label` 为 `string`。
- 通过 `bind:valuechange` 获取列值变化结果。
