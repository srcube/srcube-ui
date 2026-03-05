# @srcube-ui/react

跨 React 与微信小程序的滚动容器组件。

## 包暴露

- `@srcube-ui/react` / `@srcube-ui/react/style`：基础样式与类型定义
- `@srcube-ui/react`：React 组件（`Scrollbox`）

## React 快速上手

```tsx
import { Scrollbox } from "@srcube-ui/react";

const items = Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`);

function Example() {
  return (
    <div className="h-56">
      <Scrollbox orientation="y" showScrollbar>
        <div className="space-y-3 p-4">
          {items.map((item) => (
            <div
              key={item}
              className="h-12 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </Scrollbox>
    </div>
  );
}
```

要点：
- 父容器需要明确高度/宽度，否则不会产生滚动区域。
- `orientation` 支持 `y | x | xy`，默认 `y`。
- `hideMasks` 可隐藏遮罩提示，`showScrollbar` 可显式显示滚动条。
- `scrollEndDelay` 可配置 `scrollend` 触发延迟（默认 `120ms`）。

## 可用属性（核心）

- `orientation`: `y | x | xy`
- `hideMasks`: `boolean`
- `showScrollbar`: `boolean | null`
- `scrollEndDelay`: `number`
- 事件：React 使用 `onScroll` / `onScrollEnd` / `onScrollToUpper` / `onScrollToLower`，小程序使用 `bind:scroll` / `bind:scrollend` / `bind:scrolltoupper` / `bind:scrolltolower`
