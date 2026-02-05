# @srcube-ui/scrollbox

跨 React 与微信小程序的滚动容器组件。

## 包暴露

- `@srcube-ui/scrollbox` / `@srcube-ui/scrollbox/style`：基础样式与类型定义
- `@srcube-ui/scrollbox/react`：React 组件（`Scrollbox`）
- `@srcube-ui/scrollbox/mini`：微信小程序组件（`s-scrollbox`）

## React 快速上手

```tsx
import { Scrollbox } from "@srcube-ui/scrollbox";

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

## 小程序使用

`page.json` / `index.json` 注册：

```json
{
  "usingComponents": {
    "s-scrollbox": "@srcube-ui/scrollbox/mini"
  }
}
```

基础用法：

```wxml
<view class="h-56">
  <s-scrollbox className="h-full rounded-2xl border border-slate-200 bg-white" orientation="y">
    <view class="space-y-3 p-4">
      <view wx:for="{{items}}" wx:key="key" class="h-12 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700">
        {{item}}
      </view>
    </view>
  </s-scrollbox>
</view>
```

横向滚动（建议子项固定宽度）：

```wxml
<s-scrollbox className="h-28 rounded-2xl border border-slate-200 bg-white" orientation="x">
  <view class="flex gap-3 p-4">
    <view wx:for="{{items}}" wx:key="key" class="inline-flex h-16 w-32 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
      {{item}}
    </view>
  </view>
</s-scrollbox>
```

## 可用属性（核心）

- `orientation`: `y | x | xy`
- `hideMasks`: `boolean`
- `showScrollbar`: `boolean | null`
- 事件：React 使用 `onScroll` / `onScrollToUpper` / `onScrollToLower`，小程序使用 `bind:scroll` / `bind:scrolltoupper` / `bind:scrolltolower`
