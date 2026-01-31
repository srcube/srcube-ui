# @srcube-ui/theme

基于 Tailwind CSS v4 的 CSS-first 主题包。

## 使用方式

在入口样式中引入 Tailwind 和主题 CSS：

```css
@import "tailwindcss";
@import "@srcube-ui/theme/index.css";
```

## tv 使用（统一入口 + 分端别名）

业务侧统一写：

```ts
import { tv } from "@srcube-ui/theme/tv";
```

构建侧做别名映射：

- Web：`@srcube-ui/theme/tv` → `@srcube-ui/theme/tv-web`
- Mini：`@srcube-ui/theme/tv` → `@srcube-ui/theme/tv-mini`

## 包含内容

- 主题 tokens（primary/secondary/success/warning/danger）
- 通用 utilities（safe-area、scrollbar）
- 动画 keyframes + utilities
- Icon 组件类
