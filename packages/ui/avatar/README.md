# Avatar 头像

用于展示用户头像，支持图片、姓名首字母和图标兜底。

## 使用方式

### React

```tsx
import { Avatar } from '@srcube-ui/avatar/react';

export function Demo() {
  return <Avatar name="Srcube User" src="/avatar.png" />;
}
```

### Mini

```xml
<sr-avatar name="Srcube User" src="{{avatarUrl}}" />
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | `''` |
| alt | 图片描述（React） | `string` | `''` |
| name | 姓名（用于首字母兜底） | `string` | `''` |
| icon | 自定义兜底图标（ReactNode/string） | `ReactNode / string` | `''` |
| size | 尺寸 | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` |
| radius | 圆角 | `'none' | 'sm' | 'md' | 'lg' | 'full'` | `'full'` |
| color | 兜底背景色 | `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'` | `'default'` |
| isBordered | 是否显示描边 | `boolean` | `false` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<AvatarClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |
