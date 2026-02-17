# Tabbar

底部标签栏组件，支持 React / Mini 双端。

## 使用

### React

```tsx
import { Tabbar } from '@srcube-ui/tabbar';

<Tabbar
  items=[
    { value: 'home', label: '首页' },
    { value: 'msg', label: '消息' },
    { value: 'me', label: '我的' },
  ]
/>
```

### Mini

```json
{
  "usingComponents": {
    "sr-tabbar": "@srcube-ui/tabbar/index"
  }
}
```

```xml
<sr-tabbar items="{{items}}" value="{{value}}" bind:change="handleChange" />
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| items | 选项列表 | React: `TabbarItem[]`；Mini: `TabbarMiniItem[]` | `[]` | 全平台 |
| value | 当前值（受控） | `string \| number \| null` | - | 全平台 |
| defaultValue | 默认值（非受控） | `string \| number \| null` | 首个可用项 | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| color | 主题色 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| isBordered | 是否显示上边框 | `boolean` | `true` | 全平台 |
| onValueChange / bind:change | 选中项变化 | React: `(value) => void`；Mini: `event.detail.value` | - | 全平台 |
| className | 根节点类名 | `string` | - | 全平台 |
| classNames | slots 样式映射 | `TabbarClassNames` | - | 全平台 |
| style | 根节点样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 平台差异

- React 侧 `items[].label/icon` 支持 `ReactNode`。
- Mini 侧 `items[].label/icon` 建议使用文本。
