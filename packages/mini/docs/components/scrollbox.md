# @srcube-ui/mini/scrollbox/index

跨 React 与微信小程序的滚动容器组件。

## 包暴露

- `@srcube-ui/mini/scrollbox/index` / `@srcube-ui/mini/scrollbox/index/style`：基础样式与类型定义
- `@srcube-ui/mini/scrollbox/index`：微信小程序组件（`sr-scrollbox`）

## 小程序使用

`page.json` / `index.json` 注册：

```json
{
  "usingComponents": {
    "sr-scrollbox": "@srcube-ui/mini/scrollbox/index"
  }
}
```

基础用法：

```wxml
<view class="h-56">
  <sr-scrollbox className="h-full rounded-2xl border border-slate-200 bg-white" orientation="y">
    <view class="space-y-3 p-4">
      <view wx:for="{{items}}" wx:key="key" class="h-12 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700">
        {{item}}
      </view>
    </view>
  </sr-scrollbox>
</view>
```

横向滚动（建议子项固定宽度）：

```wxml
<sr-scrollbox className="h-28 rounded-2xl border border-slate-200 bg-white" orientation="x">
  <view class="flex gap-3 p-4">
    <view wx:for="{{items}}" wx:key="key" class="inline-flex h-16 w-32 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
      {{item}}
    </view>
  </view>
</sr-scrollbox>
```

## 可用属性（核心）

- `orientation`: `y | x | xy`
- `hideMasks`: `boolean`
- `showScrollbar`: `boolean | null`
- `scrollEndDelay`: `number`
- 事件：React 使用 `onScroll` / `onScrollEnd` / `onScrollToUpper` / `onScrollToLower`，小程序使用 `bind:scroll` / `bind:scrollend` / `bind:scrolltoupper` / `bind:scrolltolower`
