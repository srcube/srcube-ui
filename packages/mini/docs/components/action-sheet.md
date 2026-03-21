# Action Sheet 操作面板

用于从底部弹出一组操作项，适合移动端轻量操作选择。
默认点击 backdrop 不会关闭面板，需通过操作项或取消按钮收起。

## 使用方式

### API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isOpen | 是否显示面板 | `boolean` | `false` |
| defaultOpen | 非受控初始显示（React/Mini） | `boolean` | `false` |
| title | 标题 | `ReactNode / string` | `''` |
| description | 描述文案 | `ReactNode / string` | `''` |
| actions | 操作项数组 | `{ value: string \| number; label: ReactNode/string; description?: ReactNode/string; color?: 'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'; isDisabled?: boolean }[]` | `[]` |
| hasFooter | 是否启用自定义 footer 区域（启用后不渲染默认取消按钮） | `boolean` | `false` |
| footer | 自定义 footer 内容 | `ReactNode`（React）/ 具名 slot `footer`（Mini） | `-` |
| cancelText | 取消按钮文案（优先级高于 locale） | `ReactNode / string` | `locale 对应文案` |
| cancelButtonProps | 取消按钮 props 覆盖 | React: `Omit<ButtonReactProps, 'children'>`; Mini: `Partial<Pick<ButtonMiniProps, 'buttonId' \| 'color' \| 'tone' \| 'variant' \| 'size' \| 'radius' \| 'isBlock' \| 'isDisabled' \| 'isLoading' \| 'className' \| 'style' \| 'hoverClass' \| 'hoverStopPropagation' \| 'hoverStartTime' \| 'hoverStayTime' \| 'ariaLabel'>>` | `{}` |
| locale | 取消文案语言 | `'en' \| 'zh-CN' \| 'zh-TW'` | `'en'` |
| isClosable | 是否显示取消按钮 | `boolean` | `true` |
| tone | 主题明暗 | `'default' \| 'dark'` | `'default'` |
| size | 操作项尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| radius | 操作按钮组圆角 | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'lg'` |
| isInset | 是否启用底部内缩布局 | `boolean` | `false` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<ActionSheetClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onAction / action | 点击操作项 | `{ value, index, item }` |
| onCancel / cancel | 点击取消按钮时触发 | `void` |
| onOpenChange / change | 面板显示状态变化 | `{ isOpen: boolean }` / `boolean` |
