# Accordion 手风琴

用于折叠展示多段内容，支持单开和多开模式，React 与 Mini API 对齐。

## 使用方式

### React

```tsx
import { Accordion } from '@srcube-ui/accordion/react';

const items = [
  { value: 'a', title: '订单信息', content: '这里是订单信息内容' },
  { value: 'b', title: '配送信息', content: '这里是配送信息内容' },
];

export function Demo() {
  return <Accordion items={items} defaultValue="a" />;
}
```

### Mini

```xml
<sr-accordion items="{{items}}" defaultValue="a" bind:change="handleChange" />
```

```ts
Page({
  data: {
    items: [
      { value: 'a', title: '订单信息', content: '这里是订单信息内容' },
      { value: 'b', title: '配送信息', content: '这里是配送信息内容' },
    ],
  },
});
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 面板数据源 | `{ value: string \| number; title: ReactNode/string; content: ReactNode/string; isDisabled?: boolean }[]` | `[]` |
| selectionMode | 展开模式，`single` 单开 / `multiple` 多开 | `'single' \| 'multiple'` | `'single'` |
| value | 受控值；单开传单值，多开传数组 | `string \| number \| (string \| number)[] \| null` | `undefined` |
| defaultValue | 非受控初始值；单开传单值，多开传数组 | `string \| number \| (string \| number)[] \| null` | `null` |
| variant | 视觉风格 | `'outline' \| 'twotone' \| 'soft'` | `'outline'` |
| size | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| radius | 圆角 | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| isSeparated | 面板之间是否有间距 | `boolean` | `true` |
| isDisabled | 是否禁用整个组件 | `boolean` | `false` |
| hasIndicator | 是否显示右侧指示图标 | `boolean` | `true` |
| indicator | React 自定义指示图标（Mini 使用内置图标） | `ReactNode` | `'v'` |
| className | 根节点自定义类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<AccordionClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onValueChange / change | 面板展开状态变化时触发 | `single` 模式返回 `value \| null`；`multiple` 模式返回 `value[]` |
