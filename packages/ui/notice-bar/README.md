# Notice Bar 通知栏

用于展示顶部提示信息，支持颜色、尺寸、关闭按钮和 action 文案。

## 使用方式

### React

```tsx
import { NoticeBar } from '@srcube-ui/notice-bar/react';

export function Demo() {
  return (
    <NoticeBar icon="!" text="系统维护中，部分功能可能受影响。" isClosable />
  );
}
```

### Mini

```xml
<sr-notice-bar
  icon="!"
  text="系统维护中，部分功能可能受影响。"
  isClosable="{{true}}"
/>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 通知文案 | `ReactNode / string` | `''` |
| icon | 左侧图标 | `ReactNode / string` | `''` |
| action / actionText | 右侧动作内容 | `ReactNode / string` | `undefined / ''` |
| isClosable | 是否显示关闭按钮 | `boolean` | `false` |
| isVisible | 受控显示状态 | `boolean` | `true` |
| defaultVisible | 非受控初始显示状态 | `boolean` | `true` |
| color | 色彩 | `'default' | 'info' | 'success' | 'warning' | 'danger'` | `'default'` |
| size | 尺寸 | `'sm' | 'md' | 'lg'` | `'md'` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<NoticeBarClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onClose / close | 关闭时触发 | `void` |
| onVisibleChange / visibleChange | 显示状态变化时触发 | `boolean` / `{ isVisible: boolean }` |
