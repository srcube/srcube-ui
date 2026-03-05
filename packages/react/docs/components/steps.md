# Steps 步骤条

用于展示流程进度，支持横向/纵向布局、点状样式和状态覆盖。

## 使用方式

### React

```tsx
import { Steps } from '@srcube-ui/react';

export function Demo() {
  return (
    <Steps
      current={1}
      items={[
        { title: '填写信息' },
        { title: '确认支付' },
        { title: '完成' },
      ]}
    />
  );
}
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 步骤数据 | `StepsItem[]` | `[]` |
| current | 当前步骤索引 | `number` | `0` |
| orientation | 布局方向 | `'x' | 'y'` | `'x'` |
| size | 尺寸 | `'sm' | 'md' | 'lg'` | `'md'` |
| color | 主题色 | `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'` | `'primary'` |
| variant | 样式变体（与 Button 对齐，含 `twotone`） | `'solid' | 'outline' | 'flat' | 'text' | 'twotone'` | `'solid'` |
| isDot | 是否使用点状步骤 | `boolean` | `false` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<StepsClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### StepsItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一键 | `string | number` | `index` |
| title | 标题 | `ReactNode / string` | `Step {index+1}` |
| description | 描述 | `ReactNode / string` | `''` |
| icon | 自定义图标 | `ReactNode / string` | `''` |
| status | 步骤状态（不传时按 `current` 自动推导） | `'wait' | 'process' | 'finish' | 'error'` | `auto` |

> 默认图标：`finish` 使用 `icon-steps-success`，`error` 使用 `icon-steps-error`（theme icons）。

### Slots

- `base`
- `list`
- `item`
- `indicatorWrap`
- `indicator`
- `indicatorIcon`
- `indicatorText`
- `line`
- `lineStart`
- `lineEnd`
- `content`
- `titleSpacer`
- `title`
- `description`
