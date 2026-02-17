# Action Sheet 操作面板

用于从底部弹出一组操作项，适合移动端轻量操作选择。

## 使用方式

### React

```tsx
import { ActionSheet } from '@srcube-ui/action-sheet/react';

const actions = [
  { value: 'edit', label: '编辑' },
  { value: 'delete', label: '删除', color: 'danger' },
];

export function Demo() {
  return (
    <ActionSheet
      isOpen
      title="更多操作"
      actions={actions}
      onAction={(value) => console.log(value)}
    />
  );
}
```

### Mini

```xml
<sr-action-sheet
  isOpen="{{isOpen}}"
  title="更多操作"
  actions="{{actions}}"
  bind:action="handleAction"
  bind:change="handleChange"
/>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isOpen | 是否显示面板 | `boolean` | `false` |
| defaultOpen | 非受控初始显示（React/Mini） | `boolean` | `false` |
| title | 标题 | `ReactNode / string` | `''` |
| description | 描述文案 | `ReactNode / string` | `''` |
| actions | 操作项数组 | `{ value: string \| number; label: ReactNode/string; description?: ReactNode/string; color?: 'default' \| 'danger'; isDisabled?: boolean }[]` | `[]` |
| cancelText | 取消按钮文案 | `ReactNode / string` | `'取消'` |
| isClosable | 是否显示取消按钮 | `boolean` | `true` |
| shouldCloseOnOverlayPress | 点击遮罩是否关闭 | `boolean` | `true` |
| size | 操作项尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| radius | 面板圆角 | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'lg'` |
| isInset | 是否启用内缩布局 | `boolean` | `false` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<ActionSheetClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onAction / action | 点击操作项 | `{ value, index, item }` |
| onCancel / cancel | 点击取消或遮罩关闭时触发 | `void` |
| onOpenChange / change | 面板显示状态变化 | `{ isOpen: boolean }` / `boolean` |
