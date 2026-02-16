# Swipe Action

滑动操作容器，支持左右侧动作按钮揭示，提供受控/非受控开合方向能力。
组件内容固定直角，不提供 `variant` 与 `radius` 配置。

## 使用

### React

```tsx
import { SwipeAction } from '@srcube-ui/swipe-action';

export default function Demo() {
  return (
    <SwipeAction
      rightActions={[
        { key: 'more', label: '更多', color: 'secondary' },
        { key: 'delete', label: '删除', color: 'danger' },
      ]}
      onAction={(detail) => {
        console.log(detail.key, detail.direction);
      }}
    >
      <div className="h-12 bg-white px-4 flex items-center">订单 #1001</div>
    </SwipeAction>
  );
}
```

### Mini

```json
{
  "usingComponents": {
    "sr-swipe-action": "@srcube-ui/swipe-action/index"
  }
}
```

```xml
<sr-swipe-action
  rightActions="{{rightActions}}"
  bind:action="handleAction"
>
  <view class="h-12 bg-white px-4 flex items-center">订单 #1001</view>
</sr-swipe-action>
```

## API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| leftActions | 左侧动作列表 | React: `SwipeActionItem[]`；Mini: `SwipeActionMiniItem[]` | `[]` | 全平台 |
| rightActions | 右侧动作列表 | React: `SwipeActionItem[]`；Mini: `SwipeActionMiniItem[]` | `[]` | 全平台 |
| actionWidth | 单个动作按钮宽度（px） | `number` | `64` | 全平台 |
| threshold | 判定展开阈值（px，<0 时取 `actionWidth/2`） | `number` | `-1` | 全平台 |
| openDirection | 受控开合方向 | `"none" \| "left" \| "right"` | - | 全平台 |
| defaultOpenDirection | 非受控初始开合方向 | `"none" \| "left" \| "right"` | `"none"` | 全平台 |
| onOpenDirectionChange / bind:openchange | 开合方向变化回调 | React: `(direction) => void`；Mini: `event.detail.openDirection` | - | 全平台 |
| onAction / bind:action | 点击动作回调 | React: `(detail) => void`；Mini: `event.detail` | - | 全平台 |
| onTap / bind:tap | 内容区点击回调 | React: `(event) => void`；Mini: 组件事件 | - | 全平台 |
| color | 内容主题色 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| classNames | slot 样式映射 | React: `SwipeActionReactClassNames`；Mini: `SwipeActionMiniClassNames` | - | 全平台 |
| className | 根节点 class | `string` | `""` | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

### SwipeActionItem / SwipeActionMiniItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 动作唯一标识 | `string \| number` | - |
| label | 动作文案 | React: `ReactNode`；Mini: `string` | - |
| color | 动作颜色 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | 继承组件 `color` |
| iconClassName | Iconify 图标 class（Mini） | `string` | `""` |
| isDisabled | 动作禁用态 | `boolean` | `false` |
| className | 动作节点 class | `string` | `""` |

## 平台差异

### React

- 通过 Pointer Events 处理滑动手势。
- `onAction` 额外返回触发点击的 `event`。

### Mini

- 通过 `touchstart/touchmove/touchend` 处理滑动。
- 组件自身是节点，`className/style` 直接作用在组件根节点。
