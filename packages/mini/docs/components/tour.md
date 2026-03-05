# Tour

漫游式引导组件，支持目标高亮、遮罩挖洞、步骤导航与自动滚动定位。React 与 Mini 独立实现，API 语义一致，仅共享样式 variants。

## 使用

### API

### Tour

| Prop | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| isOpen | 受控开关 | `boolean` | - | 全平台 |
| defaultOpen | 非受控默认开关 | `boolean` | `false` | 全平台 |
| steps | 步骤列表 | `TourStep[]` | `[]` | 全平台 |
| currentStep | 受控当前步骤索引 | `number` | - | 全平台 |
| initialStep | 非受控初始步骤索引 | `number` | `0` | 全平台 |
| tone | 视觉风格 | `"default" \| "dark"` | `"default"` | 全平台 |
| autoScroll | 目标不在视口时自动滚动到可视区域 | `boolean` | `true` | 全平台 |
| scrollOffset | 自动滚动时顶部偏移（可用于 sticky header 遮挡补偿） | `number` | `96` | 全平台 |
| scrollDuration | 自动滚动持续时间（ms） | `number` | `220` | 全平台 |
| missingTargetStrategy | 目标缺失处理策略 | `"skip" \| "abort" \| "wait"` | `"skip"` | 全平台 |
| canMaskClose | 点击遮罩是否关闭引导 | `boolean` | `true` | 全平台 |
| canBackdropClose | 点击 backdrop / Esc 是否关闭（由 Popup 承担） | `boolean` | `false` | 全平台 |
| canShowProgress | 是否显示步骤进度文本 | `boolean` | `true` | 全平台 |
| canShowSkip | 是否显示跳过按钮 | `boolean` | `true` | 全平台 |
| canShowPrev | 是否显示上一步按钮 | `boolean` | `true` | 全平台 |
| canShowNext | 是否显示下一步/完成按钮 | `boolean` | `true` | 全平台 |
| skipText | 默认跳过文案 | React:`ReactNode` Mini:`string` | `跳过` | 全平台 |
| prevText | 默认上一步文案 | React:`ReactNode` Mini:`string` | `上一步` | 全平台 |
| nextText | 默认下一步文案 | React:`ReactNode` Mini:`string` | `下一步` | 全平台 |
| finishText | 最后一步按钮文案 | React:`ReactNode` Mini:`string` | `完成` | 全平台 |
| classNames | slots 样式映射 | `TourClassNames` | - | 全平台 |
| className | 根节点 class | `string` | `""` | 全平台 |
| style | 根节点样式 | React:`CSSProperties` Mini:`string` | - | 全平台 |
| onOpenChange / openchange | 开关变化回调 | React:`(isOpen, detail)=>void` Mini:`bind:openchange` | - | 全平台 |
| onStepChange / stepchange | 步骤变化回调 | React:`(stepIndex, step, detail)=>void` Mini:`bind:stepchange` | - | 全平台 |
| onSkip / skip | 跳过回调 | React:`(detail)=>void` Mini:`bind:skip` | - | 全平台 |
| onFinish / finish | 完成回调 | React:`(detail)=>void` Mini:`bind:finish` | - | 全平台 |
| onTargetNotFound / targetnotfound | 目标缺失回调 | React:`(detail)=>void` Mini:`bind:targetnotfound` | - | 全平台 |

### TourStep

| 字段 | 说明 | 类型 | 默认值 | 平台 |
| --- | --- | --- | --- | --- |
| id | 步骤 ID | `string \| number` | - | 全平台 |
| selector | 高亮目标选择器 | `string` | - | 全平台 |
| title | 标题 | React:`ReactNode` Mini:`string` | `""` | 全平台 |
| description | 描述 | React:`ReactNode` Mini:`string` | `""` | 全平台 |
| placement | 浮层位置 | `"auto" \| "top" \| "bottom" \| "left" \| "right"` | `"auto"` | 全平台 |
| padding | 高亮外扩距离 | `number` | `8` | 全平台 |
| radius | 高亮圆角半径 | `number` | `12` | 全平台 |
| offset | 浮层与目标间距 | `number` | `12` | 全平台 |
| canInteractWithTarget | 目标区域是否可点击 | `boolean` | `true` | 全平台 |
| showSkip | 当前步骤是否显示跳过 | `boolean` | `true` | 全平台 |
| prevText | 当前步骤覆盖上一步文案 | React:`ReactNode` Mini:`string` | - | 全平台 |
| nextText | 当前步骤覆盖下一步文案 | React:`ReactNode` Mini:`string` | - | 全平台 |
| finishText | 当前步骤覆盖完成文案 | React:`ReactNode` Mini:`string` | - | 全平台 |

## Methods

（组件实例方法）

- `start(stepIndex?)`
- `next()`
- `prev()`
- `goTo(stepIndex)`
- `close()`
- `skip()`

## 实现说明

- 遮罩方案：四块固定遮罩 + 中央高亮洞口，兼容性优先。
- 目标定位：按 `selector` 实时测量目标位置，支持步骤切换与窗口变化重算。
- 自动滚动：当目标不在可视区时，先滚动再复测定位。
