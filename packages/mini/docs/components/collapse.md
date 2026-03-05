# Collapse 折叠面板

用于折叠展示一段内容，支持受控/非受控展开状态，React 与 Mini API 对齐。

## 使用方式

### API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `ReactNode / string` | `''` |
| content | 内容（Mini 推荐传该字段；React 可用 children） | `ReactNode / string` | `undefined / ''` |
| value | 受控展开状态 | `boolean` | `undefined` |
| defaultValue | 非受控初始展开状态 | `boolean` | `false` |
| variant | 视觉风格 | `'default' | 'flat' | 'outline'` | `'default'` |
| size | 尺寸 | `'sm' | 'md' | 'lg'` | `'md'` |
| radius | 圆角 | `'none' | 'sm' | 'md' | 'lg'` | `'md'` |
| isDisabled | 是否禁用交互 | `boolean` | `false` |
| hasIndicator | 是否显示右侧指示图标 | `boolean` | `true` |
| indicator | React 自定义指示图标（Mini 使用内置图标） | `ReactNode` | 内置 `icon-chevron-down` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<CollapseClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| onValueChange / change | 展开状态变化时触发 | `boolean` |
