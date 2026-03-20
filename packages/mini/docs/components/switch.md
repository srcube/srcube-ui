# Switch

小程序开关组件。

## 使用

```json
{
  "usingComponents": {
    "sr-switch": "@srcube-ui/mini/switch/index"
  }
}
```

```xml
<sr-switch defaultSelected bind:change="onChange">消息通知</sr-switch>
```

> 小程序组件本身就是外层节点，布局样式需要显式给组件本身设置。
> 如果需要等分宽度，请给组件自身加 `class`。

## API

| Prop            | 说明                                | 类型                                                                          | 默认值      |
| --------------- | ----------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| value           | 当前值（随 change 事件透传）        | `string`                                                                      | `""`        |
| color           | 颜色主题                            | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| tone            | 明暗主题                            | `"default" \| "dark"`                                                         | `"default"` |
| size            | 尺寸                                | `"sm" \| "md" \| "lg"`                                                        | `"md"`      |
| isSelected      | 受控选中态                          | `boolean`                                                                     | -           |
| defaultSelected | 非受控默认选中                      | `boolean`                                                                     | `false`     |
| isLoading       | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"`                                                           | `false`     |
| isDisabled      | 禁用态                              | `boolean`                                                                     | `false`     |
| isReadOnly      | 只读态                              | `boolean`                                                                     | `false`     |
| hasIcon         | 是否使用 icon slot                  | `boolean`                                                                     | `false`     |
| onTap           | 点击事件                            | `bind:tap` + `e.detail.wait(Promise)`                                         | -           |
| onValueChange   | 选中变化                            | `(isSelected: boolean) => void`                                               | -           |
| classNames      | slots 样式映射                      | `SwitchClassNames`                                                            | -           |
| className       | 根节点 class                        | `string`                                                                      | -           |
| style           | 内联样式                            | `string`                                                                      | -           |

## 特性

- 默认不显示开启打勾图标；如需图标请设置 `hasIcon` 并使用 `slot="icon"`
- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）
