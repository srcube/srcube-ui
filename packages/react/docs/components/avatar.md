# Avatar 头像

用于展示用户头像，支持图片加载骨架屏、姓名首字母和自定义 fallback 兜底。默认 fallback 视觉为柔和渐变球（gradient orb）。

## 使用方式

### React

```tsx
import { Avatar } from '@srcube-ui/react';

export function Demo() {
  return <Avatar name="Srcube User" src="/avatar.png" />;
}
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | `''` |
| alt | 图片描述（React） | `string` | `''` |
| name | 姓名（用于首字母兜底） | `string` | `''` |
| icon | 自定义兜底图标（ReactNode/string） | `ReactNode / string` | `''` |
| fallback | 自定义兜底内容（优先级高于 `icon/name`） | React: `ReactNode`；Mini: `string` | `''` |
| fallbackStyle | fallback 视觉风格 | `'gradient-orb' \| 'solid'` | `'gradient-orb'` |
| fallbackTheme | 渐变主题（`auto` 会基于 seed 稳定映射） | `'auto' \| 'blue' \| 'purple' \| 'coral' \| 'mixed' \| 'emerald'` | `'auto'` |
| fallbackSeed | 渐变主题映射种子（建议传 user id） | `string \| number` | `''` |
| size | 尺寸 | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` |
| radius | 圆角 | `'none' | 'sm' | 'md' | 'lg' | 'full'` | `'full'` |
| color | 兜底背景色 | `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'` | `'default'` |
| isBordered | 是否显示描边 | `boolean` | `false` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<AvatarClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

## 行为说明

- `src` 存在时，头像使用 `Skeleton` 显示加载占位；图片 `load` 后切换为图片内容。
- 图片加载失败时自动切换到 fallback。
- fallback 样式为 `gradient-orb` 时，会渲染多层 radial-gradient + 高光层，形成球体质感。
- `fallbackTheme='auto'` 时，主题会按 `fallbackSeed` → `name` → `alt` → `src` → fallback 文本 的顺序稳定映射，避免刷新随机变化。
- fallback 内容优先级：`fallback` > `icon` > `name` 首字母 > `'?'`。
