# Button

## API 约定

### 语义一致项（必须一致）
- size: sm | md | lg（默认 md）
- variant: default（默认 default）
- isDisabled: 禁用后不触发交互

### React 侧 props
- onClick?: () => void
- className?: string
- style?: React.CSSProperties | string

### Mini 侧 props
- onTap?: () => void
- className?: string
- style?: string
