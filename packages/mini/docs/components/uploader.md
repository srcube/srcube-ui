# Uploader

图片上传组件，支持 React / Mini 双端，API 语义一致。

## 使用方式

### API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控文件列表 | `UploaderFile[]` | `undefined` |
| defaultValue | 非受控初始文件列表 | `UploaderFile[]` | `[]` |
| maxCount | 最大文件数 | `number` | `9` |
| maxSize | 单文件最大字节数（`<=0` 表示不限制） | `number` | `0` |
| accept | 文件类型（React `input.accept`） | `string` | `'image/*'` |
| isMultiple | 是否允许多选 | `boolean` | `true` |
| isRemovable | 是否允许删除 | `boolean` | `true` |
| isPreviewable | 是否允许预览 | `boolean` | `true` |
| addText | 新增按钮文案 | `ReactNode / string` | `'Upload'` |
| helperText | 辅助文案 | `ReactNode / string` | `''` |
| size | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| color | 颜色 | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| tone | 主题明暗 | `'default' \| 'dark'` | `'default'` |
| radius | 圆角 | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| isDisabled | 是否禁用 | `boolean` | `false` |
| className | 根节点类名 | `string` | `''` |
| classNames | slots 类名覆盖 | `Partial<UploaderClassNames>` | `{}` |
| style | 根节点内联样式 | `React.CSSProperties / string` | `undefined / ''` |

### UploaderFile

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 文件 ID | `string \| number` |
| url | 文件地址（本地临时路径或远端 URL） | `string` |
| name | 文件名 | `string` |
| size | 文件大小（字节） | `number` |
| type | 文件类型 | `string` |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| onValueChange / `bind:valuechange` | 文件列表变化 | `{ value: UploaderFile[] }` |
| onAdd / `bind:add` | 新增成功 | `{ added: UploaderFile[], value: UploaderFile[] }` |
| onRemove / `bind:remove` | 删除成功 | `{ file: UploaderFile, index: number, value: UploaderFile[] }` |
| onPreview / `bind:preview` | 触发预览 | `{ file: UploaderFile, index: number }` |
| onExceed / `bind:exceed` | 超出限制（数量或体积） | `{ maxCount, acceptedCount, rejectedCount, currentCount }` |

## 平台差异

- React 使用 `input[type=file]` 选取文件，默认 `onPreview` 未提供时会新开窗口预览。
- Mini 使用 `wx.chooseImage` 选图，预览使用 `wx.previewImage`。
