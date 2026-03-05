# Tabs

移动端标签页组件，提供 `Tabs` 与 `TabPanel`。React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### API

### Tabs

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| items | 标签项列表 | `Array<{ value: string \| number; label: ReactNode/Mini:string; isDisabled?: boolean }>` | `[]` | 全平台 |
| value | 受控选中值 | `string \| number \| null` | - | 全平台 |
| defaultValue | 非受控默认值 | `string \| number \| null` | 首个可用项 | 全平台 |
| onValueChange / change | 值变化回调（Mini 为 `bind:change`，`e.detail.value`） | React: `(value) => void`；Mini: `CustomEvent` | - | 全平台 |
| color | 主题色 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| variant | 样式变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` | 全平台 |
| placement | 标签头位置 | `"top" \| "start" \| "end" \| "bottom"` | `"top"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| isDisabled | 整体禁用 | `boolean` | `false` | 全平台 |
| estimateSize | 单个 tab 预估主轴尺寸（横向=宽度，纵向=高度） | `number` | 按 `size` 推导 | 全平台 |
| overscan | 虚拟渲染缓冲数量 | `number` | `5` | 全平台 |
| hideMasks | 是否隐藏滚动边缘渐隐遮罩 | `boolean` | `false` | 全平台 |
| classNames | slots 样式映射 | `TabsClassNames` | - | 全平台 |
| className | 根节点 class | `string` | `""` | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

### TabPanel

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 面板对应的 tab value | `string \| number \| null` | `null` | 全平台 |
| activeValue | 显式传入当前激活值；不传时 React 从 Tabs 上下文读取 | `string \| number \| null` | `null` | 全平台 |
| isActive | 直接指定显示状态（优先级高于 `activeValue`） | `boolean` | - | 全平台 |
| keepMounted | 非激活时是否保留节点 | `boolean` | `false` | 全平台 |
| classNames | slots 样式映射 | `TabPanelClassNames` | - | 全平台 |
| className | 根节点 class | `string` | `""` | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 行为说明

- Tabs 头部支持长列表滚动（横向/纵向均可）。
- 使用虚拟列表渲染 tab 项：React 基于 `@tanstack/react-virtual`，Mini 基于 `@tanstack/virtual-core`。
- 点击靠近可视区边缘（最前/最后）tab 时，会按点击方向自动位移：
  - 横向：前移 / 后移；
  - 纵向：上移 / 下移。
- indicator 切换动画为平移滑动，不包含缩放。

## 平台差异

- `items[].label` 为字符串。
- `Tabs` 通过 `bind:change` 抛出 `{ value }`。
- `TabPanel` 为普通面板组件，不包含 `swiper` 行为；需要 `swiper` 时在业务层自主绑定。
