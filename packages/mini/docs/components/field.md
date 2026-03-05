# Field

小程序表单控件容器，统一 label、描述/错误提示、前后缀与清空按钮视觉结构。

## 使用

```json
{
  "usingComponents": {
    "sr-field": "@srcube-ui/mini/field/index"
  }
}
```

```xml
<sr-field
  label="手机号"
  description="支持中国大陆手机号"
  value="{{phone}}"
  isClearable
  hasControl="{{true}}"
  hasEndContent
  bind:valuechange="handlePhoneValueChange"
  bind:clear="handleClear"
>
  <input
    slot=""
    id="phone-input"
    class="w-full"
    value="{{phone}}"
    placeholder="请输入手机号"
    bindinput="handlePhoneInput"
  />
  <view slot="end" class="icon-phone" />
</sr-field>
```

## API

| Prop | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 控件 id（用于 label 关联） | `string` | 自动生成 |
| label | 标签内容 | `string` | - |
| labelPlacement | 标签位置 | `"outside" \| "outside-left" \| "inside"` | `"outside"` |
| value | 受控值 | `string \| number` | - |
| defaultValue | 非受控初始值 | `string \| number` | `""` |
| placeholder | 占位内容 | `string` | - |
| description | 描述文本 | `string` | - |
| errorMessage | 错误文本（优先于 description） | `string` | - |
| hasControl | 标记使用默认 slot 渲染控件 | `boolean` | `false` |
| hasStartContent | 启用 `start` 插槽容器 | `boolean` | `false` |
| hasEndContent | 启用 `end` 插槽容器 | `boolean` | `false` |
| hasClearContent | 启用 `clear` 插槽容器 | `boolean` | `false` |
| isClearable | 是否显示清空按钮 | `boolean` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| isInvalid | 错误态 | `boolean` | `false` |
| isRequired | 必填态（仅显示星号） | `boolean` | `false` |
| isLoading | 加载态（仅视觉态） | `boolean` | `false` |
| isMultiline | 多行内容布局 | `boolean` | `false` |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| classNames | slot 样式映射 | `FieldClassNames` | - |
| className | 根节点 class | `string` | - |
| style | 根节点内联样式 | `string` | - |
| slot | 自定义控件区域 | 默认 slot | - |
| bind:valuechange | 值变化回调 | `detail.value` | - |
| bind:tap | 容器点击回调 | - | - |
| bind:clear | 清空回调 | `detail.value` | - |

## Mini 插槽

- 默认 slot：控件主体。
- `start`：前缀内容（需 `hasStartContent`）。
- `end`：后缀内容（需 `hasEndContent`）。
- `clear`：自定义清空按钮内容（需 `isClearable` + `hasClearContent`）。

## 特性

- 小程序组件本身就是一个节点，布局样式需加在组件自身
- 使用默认 slot 作为真实表单控件时，请设置 `hasControl`
