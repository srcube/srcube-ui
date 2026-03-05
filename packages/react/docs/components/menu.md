# Menu 菜单

移动端轻量菜单组件，用于承载“点击即触发”的操作列表。

## 使用方式

### React

```tsx
import { Menu } from '@srcube-ui/react';
import { Button } from '@srcube-ui/react';

export function Demo() {
  return (
    <Menu
      trigger={<Button size="sm">更多操作</Button>}
      items={[
        { value: 'edit', label: '编辑' },
        { value: 'share', label: '分享' },
        { value: 'delete', label: '删除' },
      ]}
      color="primary"
      variant="flat"
    />
  );
}
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | React 触发节点（Mini 使用 `slot="trigger"`） | `ReactNode` | - |
| items | 菜单项列表 | `MenuItem[]` | `[]` |
| value | 当前选中项（受控） | `string \| number \| null` | `null` |
| defaultValue | 默认选中项（非受控） | `string \| number \| null` | `null` |
| isOpen | 是否打开菜单 | `boolean` | `false` |
| defaultOpen | 非受控初始展开 | `boolean` | `false` |
| isDisabled | 是否禁用触发 | `boolean` | `false` |
| shouldCloseOnOutsidePress | 点击外部是否关闭 | `boolean` | `true` |
| shouldCloseOnSelect | 选中后是否自动关闭 | `boolean` | `true` |
| placement | 弹层方向 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| orientation | 菜单排列方向 | `'x' \| 'y'` | `'y'` |
| size | 菜单尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| radius | 圆角 | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| color | 选中项色彩 | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| variant | 选中项风格 | `'solid' \| 'flat'` | `'solid'` |
| tone | 菜单底色风格 | `'default' \| 'dark'` | `'default'` |
| hasArrow | 是否展示箭头 | `boolean` | `true` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<MenuClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### MenuItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 菜单项值 | `string \| number` | - |
| label | 菜单项文案 | `ReactNode / string` | - |
| isDisabled | 是否禁用 | `boolean` | `false` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onOpenChange / change | 展开状态变化 | `boolean` / `{ isOpen: boolean }` |
| onValueChange / select | 选中项变化 | `(value, { item, index })` / `{ value, item, index }` |
