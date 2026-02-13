# Tabs

移动端标签页组件，提供 `Tabs` 与 `TabPanel`。React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### React

```tsx
import { TabPanel, Tabs } from '@srcube-ui/tabs';
import { useState } from 'react';

export default function Demo() {
  const [value, setValue] = useState<'tab-1' | 'tab-2' | 'tab-3'>('tab-1');

  return (
    <Tabs
      items={[
        { value: 'tab-1', label: 'Tab 1' },
        { value: 'tab-2', label: 'Tab 2' },
        { value: 'tab-3', label: 'Tab 3' },
      ]}
      value={value}
      onValueChange={(next) => setValue(next as 'tab-1' | 'tab-2' | 'tab-3')}
      radius="full"
      color="primary"
    >
      <TabPanel value="tab-1">Panel for Tab 1</TabPanel>
      <TabPanel value="tab-2">Panel for Tab 2</TabPanel>
      <TabPanel value="tab-3">Panel for Tab 3</TabPanel>
    </Tabs>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-tabs": "@srcube-ui/tabs/index",
    "sr-tab-panel": "@srcube-ui/tabs/tab-panel/index"
  }
}
```

```xml
<sr-tabs
  items="{{tabs}}"
  value="{{value}}"
  bind:change="onTabChange"
>
  <sr-tab-panel value="tab-1" activeValue="{{value}}">
    Panel for Tab 1
  </sr-tab-panel>
  <sr-tab-panel value="tab-2" activeValue="{{value}}">
    Panel for Tab 2
  </sr-tab-panel>
  <sr-tab-panel value="tab-3" activeValue="{{value}}">
    Panel for Tab 3
  </sr-tab-panel>
</sr-tabs>
```

> 可通过 `color` 快速切换主题色，也可以通过 `classNames` 覆盖 slots。

> 需要 `swiper` 联动时，建议只使用 `Tabs` 作为标签头，并在外部自行绑定自定义 panel/swiper。

## API

### Tabs

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| items | 标签项列表 | `Array<{ value: string \| number; label: ReactNode/Mini:string; isDisabled?: boolean }>` | `[]` | 全平台 |
| value | 受控选中值 | `string \| number \| null` | - | 全平台 |
| defaultValue | 非受控默认值 | `string \| number \| null` | 首个可用项 | 全平台 |
| onValueChange / change | 值变化回调（Mini 为 `bind:change`，`e.detail.value`） | React: `(value) => void`；Mini: `CustomEvent` | - | 全平台 |
| orientation | 排列方向 | `"x" \| "y"` | `"x"` | 全平台 |
| color | 主题色 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
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

### React

- `items[].label` 支持 `ReactNode`。
- `Tabs` 内部带 indicator，切换动画为滑动平移。
- `TabPanel` 可直接作为 `Tabs` 的 children 使用，默认使用 `Tabs` 当前选中值判定显示。

### Mini

- `items[].label` 为字符串。
- `Tabs` 通过 `bind:change` 抛出 `{ value }`。
- `TabPanel` 为普通面板组件，不包含 `swiper` 行为；需要 `swiper` 时在业务层自主绑定。
