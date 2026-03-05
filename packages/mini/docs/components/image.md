# Image 图片

用于展示图片并提供加载/错误占位；支持点击预览（React 内置遮罩预览，Mini 使用 `wx.previewImage`）。

## 使用方式

### Image Preview

Mini 端通过 `isPreviewable` + `previewSrc/previewUrls` 调用原生 `wx.previewImage`，不单独提供 `ImagePreview` 组件。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | `''` |
| alt | 图片描述（React） | `string` | `''` |
| fallback | 错误占位内容 | `ReactNode / string` | `'Image unavailable'` |
| loadingText | 加载占位内容 | `ReactNode / string` | `'Loading...'` |
| previewSrc | 预览主图地址 | `string` | `''` |
| previewUrls | 预览图片列表 | `string[]` | `[]` |
| isPreviewable | 是否可点击预览 | `boolean` | `false` |
| size | 固定尺寸 | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` |
| radius | 圆角 | `'none' | 'sm' | 'md' | 'lg' | 'full'` | `'md'` |
| fit | 图片填充模式 | `'cover' | 'contain' | 'fill' | 'none'` | `'cover'` |
| ratio | 比例 | `'auto' | 'square' | 'video' | 'photo'` | `'auto'` |
| isBlock | 是否占满容器宽度 | `boolean` | `false` |
| onImageLoad | 图片加载回调（React） | `() => void` | `undefined` |
| onImageError | 图片错误回调（React） | `() => void` | `undefined` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<ImageClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Slots

- `base`
- `image`
- `placeholder`
- `previewMask`
- `previewBody`
- `previewImage`
- `previewClose`
