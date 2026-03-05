# Button

小程序按钮组件。

## 使用

```json
{
  "usingComponents": {
    "sr-button": "@srcube-ui/mini/button/index",
    "sr-button-group": "@srcube-ui/mini/button/button-group/index"
  }
}
```

```xml
<sr-button-group>
  <sr-button>确定</sr-button>
  <sr-button variant="outline">取消</sr-button>
</sr-button-group>
```

> 小程序组件本身就是外层节点，布局样式需要显式给组件本身设置。
> 如果想在 Group 内做到等分宽度，请给组件自身加 `class`：
>
> ```xml
> <sr-button-group>
>   <sr-button class="flex-1">Yes</sr-button>
>   <sr-button variant="outline" class="flex-1">No</sr-button>
> </sr-button-group>
> ```

## API

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"primary"` |
| variant | 视觉风格 | `"solid" \| "outline" \| "flat" \| "text"` | `"solid"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| isBlock | 块级按钮（占满容器） | `boolean` | `false` |
| isIcon | 是否为纯图标按钮 | `boolean` | `false` |
| isLoading | 加载态（`"auto"` 支持自动 loading） | `boolean \| "auto"` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| onTap | 点击事件 | `(event) => void` | - |
| classNames | slots 样式映射 | `ButtonClasses` | - |
| className | 根节点 class | `string` | - |
| style | 内联样式 | `string` | - |
| buttonId | 原生 button id | `string` | - |
| formType | 原生 formType | `string` | - |
| openType | 原生 openType | `string` | - |
| hoverClass | 原生 hoverClass | `string` | `"none"` |
| hoverStopPropagation | 原生 hoverStopPropagation | `boolean` | - |
| hoverStartTime | 原生 hoverStartTime | `number` | - |
| hoverStayTime | 原生 hoverStayTime | `number` | - |
| lang | 原生 lang | `string` | - |
| sessionFrom | 原生 sessionFrom | `string` | - |
| sendMessageTitle | 原生 sendMessageTitle | `string` | - |
| sendMessagePath | 原生 sendMessagePath | `string` | - |
| sendMessageImg | 原生 sendMessageImg | `string` | - |
| showMessageCard | 原生 showMessageCard | `boolean` | - |
| appParameter | 原生 appParameter | `string` | - |
| phoneNumberNoQuotaToast | 原生 phoneNumberNoQuotaToast | `boolean` | - |
| needShowEntrance | 原生 needShowEntrance | `boolean` | - |
| entrancePath | 原生 entrancePath | `string` | - |
| ariaLabel | 无障碍 label | `string` | - |

## ButtonGroup

- ButtonGroup 会向子按钮注入 `color/variant/size/radius/isBlock/isDisabled` 的默认值
- 子按钮显式传值时会覆盖 Group 的默认值
- `isBlock` 会让 Group 宽度占满，同时子按钮在组内等分宽度
- `orientation` 支持 `"x" | "y"`，用于横向/纵向排列按钮组（默认 `"x"`）

## 特性

- `onTap` 在 `isLoading="auto"` 时支持 `e.detail.wait(Promise)` 自动 loading
- 原生 button 事件由内部隐形 button 承载，外层 view 只负责样式
- 小程序组件本身就是一个节点，布局/原生样式需要显式加在组件本身（例如 `class="flex-1"`）
