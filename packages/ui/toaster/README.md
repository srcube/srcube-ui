# Toaster

全局轻提示组件，支持 React / Mini 双端，统一通过注册器 API 触发。默认表现为移动端居中层叠卡片提示。

## 使用方式

### React

```tsx
import { Toaster, addToast } from '@srcube-ui/toaster/react';

export function Demo() {
  return (
    <>
      <button
        onClick={() => {
          addToast({ title: 'Saved', description: 'Data updated' });
        }}
      >
        Show toast
      </button>
      <Toaster />
    </>
  );
}
```

### Mini

```ts
import { addToast } from '@srcube-ui/toaster/mini';

Page({
  showToast() {
    addToast({ title: 'Saved', description: 'Data updated' });
  },
});
```

```xml
<sr-toaster />
```

### 便捷方法

```ts
import { toast } from '@srcube-ui/toaster/react';

toast.success({ title: '保存成功' });
toast.warning({ title: '请注意' });
toast.danger({ title: '操作失败' });
toast.primary({ title: '提示' });
```

### 等待关闭

```ts
const handle = addToast({ title: 'Saving...' });
await handle.closed; // 等待 toast 关闭（含离场动画）
```

## API

### Toaster Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max | 最大同时显示数量（超出后保留最新 N 条） | `number` | `1` |
| className | 根节点类名 | `string` | `''` |
| classNames | slots 类名覆盖 | `Partial<ToasterClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### ToastOptions（`addToast` 入参）

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 自定义 ID | `string` | 自动生成 |
| title | 标题 | `string` | `''` |
| description | 描述 | `string` | `''` |
| tone | 语义色 | `'light' \| 'dark' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'dark'` |
| icon | 自定义图标文本 | `string` | `''` |
| duration | 自动关闭时长（ms） | `number` | `1800` |
| shouldAutoDismiss | 是否自动关闭 | `boolean` | `true` |
| isClosable | 是否展示关闭按钮 | `boolean` | `false` |
| onClose | 关闭回调 | `() => void` | `undefined` |

### AddToastResult（`addToast` 返回值）

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | toast ID | `string` |
| close | 手动关闭函数 | `() => void` |
| closed | 关闭完成 Promise | `Promise<void>` |

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

- React 通过 `createPortal` 渲染到 `document.body`。
- Mini 通过组件内部订阅 registry 渲染；需在页面放置一个 `<sr-toaster />` 节点作为挂载容器。
