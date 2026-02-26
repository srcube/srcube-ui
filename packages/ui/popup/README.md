# Popup

移动端弹层组件，React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### React

```tsx
import {
  Popup,
  PopupBackdrop,
  PopupContent,
  PopupHeader,
  PopupBody,
  PopupFooter,
} from '@srcube-ui/popup';

export default function Demo() {
  return (
    <Popup defaultOpen>
      <PopupBackdrop />
      <PopupContent>
        <PopupHeader>标题</PopupHeader>
        <PopupBody>内容</PopupBody>
        <PopupFooter>操作区</PopupFooter>
      </PopupContent>
    </Popup>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-popup": "@srcube-ui/popup/index"
  }
}
```

```xml
<sr-popup isOpen="{{isOpen}}" bind:openchange="handleOpenChange">
  <view slot="header">标题</view>
  <view slot="body">内容</view>
  <view slot="footer">操作区</view>
</sr-popup>
```

## API

### Popup

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| isOpen | 受控开关 | `boolean` | - | 全平台 |
| defaultOpen | 默认打开 | `boolean` | `false` | 全平台 |
| isDismissable | 是否允许点击遮罩关闭 | `boolean` | `true` | 全平台 |
| hasBackdrop | 是否显示遮罩 | `boolean` | `true` | 全平台 |
| motion | 内容层动画策略 | `"modal" \| "none"` | `"modal"` | 全平台 |
| backdrop | 遮罩样式 | `"transparent" \| "opaque" \| "blur"` | `"opaque"` | 全平台 |
| onOpenChange | 开关变化 | `(isOpen: boolean) => void` | - | 全平台 |
| onClose | 关闭回调 | `() => void` | - | 全平台 |
| classNames | slots 样式映射 | `VariantClasses` | - | 全平台 |
| className | 根节点 class | React: `string`；Mini: `string` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

### Slots（Mini）

- `header`
- `body`（默认 slot 也会落在 body）
- `footer`

## 平台差异

### React

- 通过子组件组合：`PopupBackdrop` / `PopupContent` / `PopupHeader` / `PopupBody` / `PopupFooter`。
- `PopupBackdrop` 内部会处理遮罩点击并触发关闭（`isDismissable`）。

### Mini

- 通过具名 slot 组织结构：`header/body/footer`。
- 组件本身是根节点，布局样式需显式设置在组件本身。

## 层级规范

- 弹窗遮罩层从 `z-index: 1000` 开始。
- 弹窗内容层为遮罩层 `+1`（默认 `1001`）。
