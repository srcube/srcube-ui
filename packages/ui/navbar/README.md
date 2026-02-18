# Navbar

顶部导航栏组件，支持 React / Mini 双端。

## 使用

### React

```tsx
import { Navbar } from '@srcube-ui/navbar';

<Navbar
  title="订单详情"
  withBack
  endContent={<button>更多</button>}
/>
```

### Mini

```json
{
  "usingComponents": {
    "sr-navbar": "@srcube-ui/navbar/index"
  }
}
```

```xml
<sr-navbar title="订单详情" withBack>
  <view slot="end">更多</view>
</sr-navbar>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| title | 标题 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| titleAlign | 标题对齐 | `"start" \| "center" \| "end"`（兼容 `"left" \| "right"`） | `"center"` | 全平台 |
| withBack | 是否启用默认返回按钮（start fallback） | `boolean` | `false` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| isBordered | 是否显示底边框 | `boolean` | `true` | 全平台 |
| hasSafeTop | 是否增加顶部安全区内边距 | `boolean` | `false` | 全平台 |
| className | 根节点类名 | `string` | - | 全平台 |
| classNames | slots 样式映射 | `NavbarClassNames` | - | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| startContent | 左侧内容 | `ReactNode` | - | React |
| endContent | 右侧内容 | `ReactNode` | - | React |
| onBack | 默认返回按钮点击回调（可 `event.preventDefault()` 阻止自动返回） | `(event) => void` | - | React |
| bind:back | 默认返回按钮点击事件（`event.detail.canBack`） | `(event) => void` | - | Mini |

## 平台差异

- React 通过 `startContent/endContent` 传入左右内容。
- Mini 通过 `slot="start"` / `slot="end"` 传入左右内容。
- `withBack` 会在未提供 `startContent` / `slot="start"` 时渲染默认返回按钮（`icon-chevron-left`）。
- Mini 端返回按钮触发 `bind:back` 后自动执行 `wx.navigateBack({ delta: 1 })`（当前页面栈可返回时）。
