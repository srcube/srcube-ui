# Drawer

抽屉组件，基于 `Popup` 组合实现，支持 React 与小程序，API 语义一致。

- 复用 `@srcube-ui/popup` 的开关控制与遮罩行为
- 支持四个方向：`left / right / top / bottom`
- 支持 `header / body / footer` 结构化内容

## 使用

### React

```tsx
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@srcube-ui/drawer';

export default function Demo() {
  return (
    <Drawer defaultOpen placement="right">
      <DrawerContent>
        <DrawerHeader>Drawer Title</DrawerHeader>
        <DrawerBody>Drawer body content.</DrawerBody>
        <DrawerFooter>Actions</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-drawer": "@srcube-ui/drawer/index"
  }
}
```

```xml
<sr-drawer
  isOpen="{{isOpen}}"
  placement="right"
  title="Drawer Title"
  bind:openchange="handleOpenChange"
>
  <view slot="body">Drawer body content.</view>
  <view slot="footer">Actions</view>
</sr-drawer>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| isOpen | 受控开关 | `boolean` | - | 全平台 |
| defaultOpen | 默认打开 | `boolean` | `false` | 全平台 |
| isDismissable | 是否允许点击遮罩关闭 | `boolean` | `true` | 全平台 |
| hasBackdrop | 是否显示遮罩 | `boolean` | `true` | 全平台 |
| backdrop | 遮罩样式 | `"transparent" \| "opaque" \| "blur"` | `"opaque"` | 全平台 |
| placement | 抽屉方向 | `"left" \| "right" \| "top" \| "bottom"` | `"bottom"` | 全平台 |
| title | 标题（默认头部内容） | React: `ReactNode`；Mini: `string` | - | 全平台 |
| onOpenChange / bind:openchange | 开关变化 | React: `(isOpen: boolean) => void`；Mini: `event.detail.isOpen` | - | 全平台 |
| onClose / bind:close | 关闭回调 | React: `() => void`；Mini: 组件事件 | - | 全平台 |
| classNames | slots 样式映射 | React: `DrawerReactClassNames`；Mini: `DrawerMiniClassNames` | - | 全平台 |
| className | 根节点 class | React: `string`；Mini: `string` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## Slots（Mini）

- `header`
- `body`（默认 slot 也会落在 body）
- `footer`

## 平台差异

### React

- 建议使用组合子组件：`DrawerContent / DrawerHeader / DrawerBody / DrawerFooter`。
- 当未显式传入 `DrawerContent` 时，`Drawer` 会自动用 `DrawerContent` 包裹子内容。
- `title` 可作为默认头部内容；若传入 `DrawerHeader`，则以 `DrawerHeader` 为准。

### Mini

- 通过具名 slot 组织结构：`header/body/footer`。
- 内部复用 `sr-popup` 承载开关与遮罩逻辑，`placement` 仅控制抽屉面板方向与动画。
- 组件本身是根节点，布局样式需显式设置在组件本身。
