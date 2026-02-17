# Popover 气泡卡片

用于点击触发显示一段浮层信息，支持方向、尺寸和受控开关。

## 使用方式

### React

```tsx
import { Popover } from '@srcube-ui/popover/react';

export function Demo() {
  return (
    <Popover
      trigger={<span>点击查看</span>}
      title="配送说明"
      content="支持工作日与周末配送。"
    />
  );
}
```

### Mini

```xml
<sr-popover title="配送说明" content="支持工作日与周末配送。">
  <view slot="trigger">点击查看</view>
</sr-popover>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | React 触发节点（Mini 使用 `slot="trigger"`） | `ReactNode` | - |
| title | 标题 | `ReactNode / string` | `''` |
| content | 内容 | `ReactNode / string` | `''` |
| isOpen | 是否打开 | `boolean` | `false` |
| defaultOpen | 非受控初始状态 | `boolean` | `false` |
| isDisabled | 是否禁用触发 | `boolean` | `false` |
| shouldCloseOnOutsidePress | 点击外部是否关闭 | `boolean` | `true` |
| placement | 展示方向 | `'top' | 'bottom' | 'left' | 'right'` | `'bottom'` |
| size | 尺寸 | `'sm' | 'md' | 'lg'` | `'md'` |
| hasArrow | 是否显示箭头 | `boolean` | `true` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<PopoverClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onOpenChange / change | 展开状态变化 | `boolean` / `{ isOpen: boolean }` |
