# @srcube-ui/react

React 组件实现，基于 React Aria Components。

## 安装

```bash
pnpm add @srcube-ui/react
```

## 使用

```tsx
import { Button } from '@srcube-ui/react';

export default function App() {
  return <Button color="primary">Click me</Button>;
}
```

## 特性

- 基于 React Aria Components，提供完整无障碍支持
- 支持函数式 className：`(state) => string`
- 支持 `isLoading="auto"` 自动 loading
- 样式基于 Tailwind CSS

## 依赖边界

- 允许依赖：`@srcube-ui/styles`
- 禁止依赖：`@srcube-ui/mini`

## 文档

组件文档位于 `docs/components/`。
