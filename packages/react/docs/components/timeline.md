# Timeline 时间线

用于展示按时间排序的事件流，支持颜色、线条样式和待处理节点。

## 使用方式

### React

```tsx
import { Timeline } from '@srcube-ui/react';

export function Demo() {
  return (
    <Timeline
      items={[
        { title: '需求评审', time: '09:30' },
        { title: '开发中', time: '10:20', color: 'primary' },
      ]}
    />
  );
}
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 时间线数据 | `TimelineItem[]` | `[]` |
| size | 尺寸 | `'sm' | 'md' | 'lg'` | `'md'` |
| color | 默认节点颜色 | `'default' | 'primary' | 'success' | 'warning' | 'danger'` | `'default'` |
| lineStyle | 线条样式 | `'solid' | 'dashed'` | `'solid'` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<TimelineClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### TimelineItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一键 | `string | number` | `index` |
| title | 标题 | `ReactNode / string` | `Event {index+1}` |
| time | 时间文本 | `ReactNode / string` | `''` |
| description | 描述文本 | `ReactNode / string` | `''` |
| icon | 自定义节点图标 | `ReactNode / string` | `''` |
| color | 节点颜色（覆盖组件 `color`） | `'default' | 'primary' | 'success' | 'warning' | 'danger'` | 继承组件 `color` |
| isPending | 是否待处理节点（空心） | `boolean` | `false` |

> `icon` 为可选自定义内容；组件不会按状态自动注入内置图标。

### Slots

- `base`
- `list`
- `item`
- `head`
- `node`
- `icon`
- `line`
- `content`
- `title`
- `time`
- `description`
