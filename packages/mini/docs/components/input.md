# Input

小程序单行输入组件，基于 `Field`。

## 使用

```json
{
  "usingComponents": {
    "sr-input": "@srcube-ui/mini/input/index"
  }
}
```

```xml
<sr-input
  label="手机号"
  value="{{phone}}"
  placeholder="请输入手机号"
  isClearable
  bind:valuechange="handlePhoneValueChange"
/>
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
| description | 描述文本（无错误时显示） | `string` | - |
| errorMessage | 错误文本（优先于 description） | `string` | - |
| isClearable | 是否显示清空按钮（有值时显示） | `boolean` | `false` |
| isDisabled | 禁用态 | `boolean` | `false` |
| isReadOnly | 只读态 | `boolean` | `false` |
| isInvalid | 错误态 | `boolean` | `false` |
| isRequired | 必填态（仅显示星号） | `boolean` | `false` |
| isLoading | 加载态（仅视觉态） | `boolean` | `false` |
| color | 颜色主题 | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` |
| variant | 视觉变体 | `"default" \| "outline" \| "twotone" \| "underline"` | `"default"` |
| size | 尺寸 | `"sm" \| "md" \| "lg"` | `"md"` |
| radius | 圆角 | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` |
| className | 根节点 class | `string` | - |
| classNames | Field slots 样式映射 | `FieldClassNames` | - |
| inputClassName | 输入框 class | `string` | - |
| bind:valuechange | 值变化回调 | `detail.value` | - |
| bind:clear | 清空回调 | `detail.value` | - |
| bind:tap | 容器点击回调 | - | - |

## 特性

- 透传小程序 `input` 常用属性：`inputType/maxLength/confirmType/isPassword/isConfirmHold/isAlwaysEmbed`
- 前后缀使用 `start/end` slot，需配合 `hasStartContent/hasEndContent`
