# Card

内容容器组件，提供 `header / body / footer` 三段式结构。

- React / Mini 双端实现
- 支持 `color`、`size`、`radius`

## 使用

### API

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | 全平台 |
| tone | 明暗主题 | `"default" \| "dark"` | `"default"` | 全平台 |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` | 全平台 |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | 全平台 |
| header | 头部内容 | `ReactNode` | - | React |
| body | 主体内容 | `ReactNode` | - | React |
| footer | 底部内容 | `ReactNode` | - | React |
| hasHeader | 启用 `header` 插槽容器 | `boolean` | `false` | Mini |
| hasFooter | 启用 `footer` 插槽容器 | `boolean` | `false` | Mini |
| className | 根节点样式 | `string` | `""` | 全平台 |
| classNames | slots 样式映射（`base/header/body/footer`） | React: `CardReactClassNames`；Mini: `CardMiniClassNames` | - | 全平台 |
| style | 内联样式 | React: `CSSProperties`；Mini: `string` | - | 全平台 |
| children / slot | 主体内容（React 作为 `body` 回退；Mini 作为默认 slot） | React: `ReactNode`；Mini: 默认 slot | - | 全平台 |

## Mini Slots

- `header`：头部区域（需 `hasHeader=true`）
- `body`：主体区域（可选，不传时回退默认 slot）
- `footer`：底部区域（需 `hasFooter=true`）
