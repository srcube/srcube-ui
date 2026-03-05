# InputOtp

OTP 验证码输入组件，React 与小程序独立实现，API 语义一致，仅共享样式 variants。

## 使用

### React

```tsx
import { InputOtp } from '@srcube-ui/react';
import { useState } from 'react';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <InputOtp
      value={value}
      length={6}
      variant="outline"
      onValueChange={setValue}
      onComplete={(code) => {
        console.log(code);
      }}
    />
  );
}
```

## API

### InputOtp

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| value | 受控输入值 | `string` | - | 全平台 |
| defaultValue | 非受控初始值 | `string` | `""` | 全平台 |
| length | 验证码长度 | `number` | `4` | 全平台 |
| keyboardType | 键盘类型 | React: `"text" \| "number" \| "digit" \| "tel" \| "password"`；Mini: `string` | `"number"` | 全平台 |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` | 全平台 |
| size | 尺寸 | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"lg"` | 全平台 |
| isDisabled | 禁用态 | `boolean` | `false` | 全平台 |
| isReadOnly | 只读态 | `boolean` | `false` | 全平台 |
| isPassword | 密码显示（字符改为圆点） | `boolean` | `false` | 全平台 |
| onChange | 原生输入变更回调 | React: `(event) => void`；Mini: `bind:change` | - | 全平台 |
| onValueChange | 值变更回调 | React: `(value: string) => void`；Mini: `bind:valuechange` | - | 全平台 |
| onComplete | 填满长度时回调 | React: `(value: string) => void`；Mini: `bind:complete` | - | 全平台 |
| classNames | slots 样式映射 | `InputOtpClassNames` | - | 全平台 |
| className | 根节点 class | `string` | - | 全平台 |
| style | 根节点内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |

## 平台差异

### React

- `onValueChange` 每次输入都会触发，且值会先按 `length` 截断。
- 点击容器会聚焦隐藏 input（`isDisabled` 或 `isReadOnly` 时不聚焦）。

#