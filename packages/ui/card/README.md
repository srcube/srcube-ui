# Card

内容容器组件，支持标题区、内容区、底部操作区。

- React / Mini 双端实现
- 支持尺寸、圆角、阴影、边框
- Header / Footer 支持分隔线控制

## 使用

### React

```tsx
import { Card } from '@srcube-ui/card';

export default function Demo() {
  return (
    <Card
      title="订单信息"
      description="2026-02-18 10:30"
      footer={<button>查看详情</button>}
      isHeaderDivider
      isFooterDivider
    >
      <div>订单号：A20260218001</div>
    </Card>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-card": "@srcube-ui/card/index"
  }
}
```

```xml
<sr-card
  title="订单信息"
  description="2026-02-18 10:30"
  hasFooter="{{true}}"
  isHeaderDivider="{{true}}"
  isFooterDivider="{{true}}"
>
  <view>订单号：A20260218001</view>
  <view slot="footer">查看详情</view>
</sr-card>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| title | 标题 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| description | 描述文案 | React: `ReactNode`；Mini: `string` | - | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| shadow | 阴影强度 | `"none" \| "sm" \| "md" \| "lg"` | `"sm"` | 全平台 |
| isBordered | 是否显示边框 | `boolean` | `true` | 全平台 |
| isHeaderDivider | 标题区后是否显示分隔线 | `boolean` | `false` | 全平台 |
| isFooterDivider | 底部区前是否显示分隔线 | `boolean` | `false` | 全平台 |
| className | 根节点样式 | `string` | `""` | 全平台 |
| classNames | slots 样式映射（`base/header/headerMain/title/description/startContent/endContent/body/footer/divider`） | React: `CardReactClassNames`；Mini: `CardMiniClassNames` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 平台差异

### React

- 支持 `startContent` / `endContent` / `header` / `footer` 作为 `ReactNode`。
- `children` 渲染在 `body` 区域。

### Mini

- Header / Footer 内容通过 `slot` 传入：`header`、`startContent`、`endContent`、`footer`。
- 需显式声明 `hasHeader` / `hasFooter` / `hasStartContent` / `hasEndContent` 以渲染对应 slot 容器。
