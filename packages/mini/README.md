# @srcube-ui/mini

小程序组件实现。

## 安装

```bash
pnpm add @srcube-ui/mini
```

## 使用

```json
{
  "usingComponents": {
    "sr-button": "@srcube-ui/mini/button/index"
  }
}
```

```xml
<sr-button color="primary">Click me</sr-button>
```

## 特性

- 支持微信小程序原生属性
- 支持 `isLoading="auto"` 配合 `e.detail.wait(Promise)`
- 样式基于 Tailwind CSS

## 依赖边界

- 允许依赖：`@srcube-ui/styles`
- 禁止依赖：`@srcube-ui/react`

## 文档

组件文档位于 `docs/components/`。
