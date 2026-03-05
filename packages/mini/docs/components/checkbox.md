# Checkbox

小程序复选组件。

## 使用

```json
{
  "usingComponents": {
    "sr-checkbox": "@srcube-ui/mini/checkbox/index",
    "sr-checkbox-group": "@srcube-ui/mini/checkbox/checkbox-group/index"
  }
}
```

```xml
<sr-checkbox-group value="{{value}}" bind:change="onChange">
  <sr-checkbox value="a">选项 A</sr-checkbox>
  <sr-checkbox value="b">选项 B</sr-checkbox>
</sr-checkbox-group>
```

> 小程序组件本身就是外层节点，布局样式需要显式给组件本身设置。
> 如果需要等分宽度，请给组件自身加 `class`。

## API

### Checkbox

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值 | `string` | `""` |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| isSelected | 选中态（独立使用时） | `boolean` | `false` |
| defaultSelected | 默认选中（独立使用时） | `boolean` | `false` |
| isIndeterminate | 半选态 | `boolean` | `false` |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| isLineThrough | 选中划线 | `boolean` | `false` |
| onTap | 点击事件 | `(event) => void \| Promise<void>` | - |
| onValueChange | 选中变化（独立使用时） | `(isSelected: boolean) => void` | - |
| classNames | slots 样式映射 | `CheckboxClasses` | - |
| className | 根节点 class | `string` | - |
| style | 内联样式 | `string` | - |

### CheckboxGroup

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控值 | `string[] \| null` | - |
| defaultValue | 默认值 | `string[] \| null` | - |
| onValueChange | 选中值变化 | `(value: string[]) => void` | - |
| orientation | 排列方向 | `"x" \| "y"` | `"y"` |
| isBlock | 宽度占满父级 | `boolean` | `false` |
| color | 默认颜色 | `Checkbox['color']` | - |
| size | 默认尺寸 | `Checkbox['size']` | - |
| radius | 默认圆角 | `Checkbox['radius']` | - |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| isLineThrough | 选中划线 | `boolean` | `false` |
| className | 根节点 class | `string` | - |
| style | 内联样式 | `string` | - |

## 特性

- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）
