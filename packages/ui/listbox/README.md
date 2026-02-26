# Listbox

支持 React 与小程序的虚拟列表组件，双端独立实现，语义一致。

- React: 基于 `@tanstack/react-virtual`
- Mini: 基于 `@tanstack/virtual-core`
- Scroll 容器：复用 `@srcube-ui/scrollbox`（继承滚动容器能力）

## 使用

### React

```tsx
import { Listbox } from '@srcube-ui/listbox';

const items = [
  { id: 'group-a', label: 'Group A', isSticky: true },
  ...Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    label: `Option ${index + 1}`,
  })),
];

export default function Demo() {
  return (
    <Listbox
      className="h-72"
      size="md"
      items={items}
      estimateSize={44}
      hasDivider
      hideMasks={false}
      showScrollbar={false}
    />
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-listbox": "@srcube-ui/listbox/index"
  }
}
```

```xml
<sr-listbox
  className="h-72 rounded-xl border border-slate-200"
  size="md"
  items="{{items}}"
  estimateSize="44"
  hasDivider
  hideMasks="{{false}}"
  showScrollbar="{{false}}"
/>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| items | 列表数据 | React: `ListboxItem[]`；Mini: `ListboxMiniItem[]` | `[]` | 全平台 |
| items[].isSticky | 是否为吸顶节点（按当前滚动方向吸顶） | `boolean` | `false` | 全平台 |
| estimateSize | 预估项尺寸 | React: `number \| (index) => number`；Mini: `number` | `40` | 全平台 |
| overscan | 预渲染缓冲项数量 | `number` | `5` | 全平台 |
| orientation | 滚动方向 | `'y' \| 'x'` | `'y'` | 全平台 |
| size | 尺寸（同步项高/文字/空态尺寸） | `'sm' \| 'md' \| 'lg'` | `'md'` | 全平台 |
| hasDivider | 是否显示分割线 | `boolean` | `false` | 全平台 |
| items[].className | 自定义项容器类名 | `string` | `''` | 全平台 |
| items[].labelClassName | 自定义项文本类名 | `string` | `''` | 全平台 |
| items[].endIconClassName | 项右侧图标类名（默认渲染器） | `string` | `''` | 全平台 |
| hideEmptyContent | 空列表时隐藏空态 | `boolean` | `false` | 全平台 |
| emptyContent | 自定义空态文案 | React: `ReactNode`；Mini: `string` | `locale 对应文案` | 全平台 |
| locale | 空态语言 | `'en' \| 'zh-CN' \| 'zh-TW'` | `'en'` | 全平台 |
| classNames | slots 样式映射 | React: `ListboxReactClassNames`；Mini: `ListboxMiniClassNames` | - | 全平台 |
| className | 根节点样式 | `string` | - | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| onItemPress / bind:itemtap | 项点击事件 | React: `(item, index) => void`；Mini: `event.detail.item/index` | - | 全平台 |
| hideMasks | 是否隐藏滚动遮罩 | `boolean` | `false` | 全平台 |
| showScrollbar | 是否显示滚动条 | `boolean \| null` | `null` | 全平台 |
| upperThreshold / lowerThreshold | 滚动上下阈值 | `number` | `50` | 全平台 |
| scrollTop / scrollLeft | 受控滚动位置 | `number \| null` | `null` | 全平台 |
| scrollIntoView | 滚动到指定元素 | `string` | `''` | 全平台 |
| scrollWithAnimation | 滚动是否带动画 | `boolean` | `false` | 全平台 |
| onScroll / bind:scroll | 滚动事件 | React: `UIEventHandler`；Mini: `event.detail.scrollTop/scrollLeft` | - | 全平台 |
| onScrollToUpper / bind:scrolltoupper | 滚动到顶部阈值事件 | 回调/事件 | - | 全平台 |
| onScrollToLower / bind:scrolltolower | 滚动到底部阈值事件 | 回调/事件 | - | 全平台 |

## 平台差异

### React

- `items[].label` 支持 `ReactNode`。
- 支持 `renderItem` 自定义渲染。
- 支持 `shouldMeasureItem` 按需接入 `virtualizer.measureElement`。
- 使用 `renderItem` 时，`items[].endIconClassName` 由业务自定义内容接管。
- 内部通过 `rangeExtractor` 计算激活 sticky 项，并在虚拟项内应用 `position: sticky`（支持纵向/横向）。
- 内部通过 `Scrollbox` 的 `scrollRef` 对接虚拟列表滚动容器。
- 组件本身不维护选中态；如需选中交互请使用 `Selectbox`。

### Mini

- `items[].label` 为 `string`。
- 对外事件：`bind:itemtap`、`bind:scroll`。
- 基于 `sr-scrollbox` 承载滚动，继承其遮罩/阈值/滚动控制能力。
- 同样使用 `rangeExtractor` 参与 sticky 渲染，并将激活 sticky 项切换为 `position:sticky`。
- `items[].endIconClassName` 会在 label 右侧渲染图标节点。
- `classNames.$scrollbox` 仅用于控制嵌套 `sr-scrollbox` 组件节点本身布局（默认 `flex grow`；`y` 方向附加 `min-h-0`，`x` 方向附加 `min-w-0`）。
- `classNames.scrollbox` 传递给 `sr-scrollbox` 的 `className` 属性（默认 `w-full h-full`）。
- 小程序组件自身为节点，布局类（如高度）需直接加在 `sr-listbox` 上。
- 组件本身不维护选中态；如需选中交互请使用 `Selectbox`。
