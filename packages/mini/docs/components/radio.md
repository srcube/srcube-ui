# Radio

小程序单选组件。

## 使用

```json
{
  "usingComponents": {
    "sr-radio": "@srcube-ui/mini/radio/index",
    "sr-radio-group": "@srcube-ui/mini/radio/radio-group/index"
  }
}
```

```xml
<sr-radio-group value="{{value}}" bind:change="onChange">
  <sr-radio value="a">选项 A</sr-radio>
  <sr-radio value="b">选项 B</sr-radio>
</sr-radio-group>
```

> 小程序组件本身就是外层节点，布局样式需要显式给组件本身设置。
> 如果需要等分宽度，请给组件自身加 `class`。

## API

### Radio

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值 | `string` | `""` |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| isSelected | 选中态（独立使用时） | `boolean` | `false` |
| defaultSelected | 默认选中（独立使用时） | `boolean` | `false` |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| hasIcon | 是否使用 icon slot | `boolean` | `false` |
| onTap | 点击事件 | `(event) => void \| Promise<void>` | - |
| onValueChange | 选中变化（独立使用时） | `(isSelected: boolean) => void` | - |
| classNames | slots 样式映射 | `RadioClasses` | - |
| className | 根节点 class | `string` | - |
| style | 内联样式 | `string` | - |

### RadioGroup

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控值 | `string \| null` | - |
| defaultValue | 默认值 | `string \| null` | - |
| onValueChange | 选中值变化 | `(value: string) => void` | - |
| orientation | 排列方向 | `"x" \| "y"` | `"y"` |
| isBlock | 宽度占满父级 | `boolean` | `false` |
| color | 默认颜色 | `Radio['color']` | - |
| size | 默认尺寸 | `Radio['size']` | - |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| className | 根节点 class | `string` | - |
| style | 内联样式 | `string` | - |

## 特性

- 支持 `slot="icon"` 自定义图标（需同时设置 `hasIcon`）
- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）
