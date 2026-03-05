# Toaster

全局轻提示组件，支持 React / Mini 双端，统一通过 registry API 触发。

## 使用

### API

### Toaster

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| className | 根节点类名 | React: `string`；Mini: `string` | React: `undefined`；Mini: `''` | 全平台 |
| classNames | slots 类名覆盖 | React: `Partial<ToasterReactClassNames>`；Mini: `Partial<ToasterMiniClassNames>` | React: `undefined`；Mini: `{}` | 全平台 |
| style | 根节点样式 | React: `React.CSSProperties`；Mini: `string` | React: `undefined`；Mini: `''` | 全平台 |

### ToastOptions（`addToast` 入参）

| 字段 | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| id | 自定义 ID | `string` | 自动生成 | 全平台 |
| title | 标题 | `string` | `''` | 全平台 |
| description | 描述 | `string` | `''` | 全平台 |
| tone | 语义色 | `'light' \| 'dark' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'dark'` | 全平台 |
| icon | 自定义图标文本 | `string` | `''` | 全平台 |
| duration | 自动关闭时长（ms） | `number` | `1800` | 全平台 |
| shouldAutoDismiss | 是否自动关闭 | `boolean` | `true` | 全平台 |
| showClose | 是否显示关闭按钮（仅最新顶层会实际显示） | `boolean` | `false` | 全平台 |
| onClose | 关闭回调 | `() => void` | `undefined` | 全平台 |

### AddToastResult（`addToast` 返回值）

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | toast ID | `string` |
| close | 手动关闭函数 | `() => void` |
| closed | 关闭完成 Promise（含离场动画） | `Promise<void>` |

### Registry API

| 方法 | 说明 |
| --- | --- |
| `addToast(options)` / `showToast(options)` | 新增 toast，返回 `AddToastResult` |
| `closeToast(id)` | 关闭单个 toast（带离场动画） |
| `clearToasts()` | 清空所有 toast |
| `getToasts()` | 获取当前 toast 快照 |
| `subscribeToasts(listener)` | 订阅 toast 列表变化 |
| `toast.success(options)` | 成功提示 |
| `toast.warning(options)` | 警告提示 |
| `toast.danger(options)` | 危险提示 |
| `toast.primary(options)` | 主题色提示 |

## 平台差异

- React：通过 `createPortal` 渲染到 `document.body`。
- Mini：通过组件内部订阅 registry 渲染，需要页面放置 `<sr-toaster />` 作为挂载容器。

## 备注（可选）

- 展示层数固定为 3 层，仅保留最新 3 条 toast。
- 多层视觉方向为“最新在上，历史层向下偏移”。
- `showClose` 仅控制关闭按钮展示，不影响 toast 自动倒计时与切换语义。
