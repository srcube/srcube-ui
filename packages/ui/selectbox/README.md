# Selectbox

基于 `Listbox` 的选中容器组件，支持单选/多选，保留虚拟滚动与 sticky 能力。

- React：`@srcube-ui/selectbox/react`
- Mini：`@srcube-ui/selectbox/mini`

## 使用

### React

```tsx
import { Selectbox } from '@srcube-ui/selectbox';

export default function Demo() {
  return (
    <Selectbox
      className="h-72 rounded-2xl border border-slate-200"
      color="primary"
      size="md"
      selectIcon
      selectionMode="multiple"
      items={[
        { id: 'apple', label: 'Apple' },
        { id: 'banana', label: 'Banana' },
        { id: 'orange', label: 'Orange' },
      ]}
      defaultValue={['apple']}
    />
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-selectbox": "@srcube-ui/selectbox/index"
  }
}
```

```xml
<sr-selectbox
  className="h-72 rounded-2xl border border-slate-200"
  color="primary"
  size="md"
  selectIcon="{{true}}"
  selectionMode="multiple"
  items="{{items}}"
  value="{{value}}"
  bind:valuechange="handleValueChange"
/>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| items | 可选项列表 | React: `SelectboxItem[]`；Mini: `SelectboxMiniItem[]` | `[]` | 全平台 |
| value | 受控值 | `Array<string \| number>` | - | 全平台 |
| defaultValue | 非受控初始值 | `Array<string \| number>` | `[]` | 全平台 |
| selectionMode | 选择模式 | `'single' \| 'multiple'` | `'multiple'` | 全平台 |
| orientation | 布局方向 | `'y' \| 'x'` | `'y'` | 全平台 |
| color | 主题色（同步选中背景/文字） | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 全平台 |
| size | 尺寸（同步 list 行高/文字/选中块半径） | `'sm' \| 'md' \| 'lg'` | `'md'` | 全平台 |
| selectIcon | 选中项右侧显示 `icon-check`，颜色跟随选中文字 | `boolean` | `false` | 全平台 |
| estimateSize | 虚拟列表预估项高；不传时按 `size` 兜底（`sm=36`、`md=44`、`lg=52`） | React: `number \| (index) => number`；Mini: `number \| null` | `size 对应值` | 全平台 |
| overscan | 预渲染缓冲项数量 | `number` | `5` | 全平台 |
| hasDivider | 是否显示分割线 | `boolean` | `false` | 全平台 |
| classNames | slots 样式映射 | React: `SelectboxReactClassNames`；Mini: `SelectboxMiniClassNames` | - | 全平台 |
| className | 根节点样式 | `string` | `''` | 全平台 |
| onValueChange / bind:valuechange | 值变化回调 | React: `(value) => void`；Mini: `event.detail.value` | - | 全平台 |
| onItemPress / bind:itemtap | 项点击回调 | React: `(item, index, value) => void`；Mini: `event.detail.item/index/value` | - | 全平台 |
