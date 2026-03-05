# @srcube-ui/styles

样式契约层，提供跨平台共享的 design tokens 和组件样式定义。

## 职责

- Design tokens / theme 配置
- 组件 variants / slots 契约（基于 tailwind-variants）
- 类型导出

## 使用

```ts
import { buttonStyles } from '@srcube-ui/styles/components/button';

const classes = buttonStyles({
  color: 'primary',
  variant: 'solid',
  size: 'md',
});
```

## 导出

- 根导出：`@srcube-ui/styles`
- 组件导出：`@srcube-ui/styles/components/<component>`
- 样式入口：`@srcube-ui/styles/css`

## 约束

- 禁止包含 React/mini 运行时逻辑
- 禁止调用 DOM/小程序 API
- 仅提供纯样式契约和类型定义
