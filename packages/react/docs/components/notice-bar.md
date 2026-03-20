# Notice Bar 通知栏

用于展示顶部提示信息，支持颜色、尺寸、关闭按钮与文本轮播动画。

## 使用方式

### React

```tsx
import { NoticeBar } from '@srcube-ui/react';

export function Demo() {
  return (
    <NoticeBar
      icon="!"
      items={['系统维护中，部分功能可能受影响。', '预计 02:30 恢复服务。']}
      isAutoPlay
      isClosable
    />
  );
}
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 单条通知文案 | `ReactNode / string` | `''` |
| items | 多条通知文案（用于自动轮播） | `string[]` | `[]` |
| icon | 左侧图标 | `ReactNode / string` | `''` |
| action / actionText | 右侧动作内容 | `ReactNode / string` | `undefined / ''` |
| isClosable | 是否显示关闭按钮（使用 `icon-close`） | `boolean` | `false` |
| isAutoPlay | 是否自动切换 `items` | `boolean` | `false` |
| isMarquee | 是否启用文字从右向左滚动 | `boolean` | `false` |
| switchInterval | 自动切换间隔（毫秒） | `number` | `3000` |
| switchDuration | 单次向下切换动画时长（毫秒） | `number` | `280` |
| marqueeDuration | 单条文字横向滚动时长（毫秒） | `number` | `6000` |
| isVisible | 受控显示状态 | `boolean` | `true` |
| defaultVisible | 非受控初始显示状态 | `boolean` | `true` |
| color | 色彩 | `'default' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| tone | 明暗主题 | `'default' \| 'dark'` | `'default'` |
| size | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<NoticeBarClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onClose / close | 关闭时触发 | `void` |
| onVisibleChange / visibleChange | 显示状态变化时触发 | `boolean` / `{ isVisible: boolean }` |
