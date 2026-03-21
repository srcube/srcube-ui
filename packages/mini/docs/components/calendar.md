# Calendar 日历

提供单选日历（Calendar）与区间日历（CalendarRange），采用「月份列表 + 粘性月份标题」交互：

- 顶部使用扁平按钮展示当前年月
- 点击后打开 Year/Month 选择面板（Pickbox）
- 关闭面板时列表无动画跳转到目标月份

## 使用方式

### API

### Common Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| month | 当前展示月份 | `string (YYYY-MM)` | `''` |
| minDate | 最小可选日期 | `string (YYYY-MM-DD)` | `''` |
| maxDate | 最大可选日期 | `string (YYYY-MM-DD)` | `''` |
| disabledDates | 禁用日期集合 | `string[]` | `[]` |
| weekStartsOn | 每周起始日（0=周日） | `0..6` | `0` |
| helperText | 底部辅助文案 | `ReactNode / string` | `''` |
| size | 尺寸 | `'sm' | 'md' | 'lg'` | `'md'` |
| radius | 圆角 | `'none' | 'sm' | 'md' | 'lg' | 'full'` | `'md'` |
| color | 主题色 | `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'` | `'primary'` |
| tone | 主题明暗 | `'default' | 'dark'` | `'default'` |
| className | 根节点类名 | `string` | `''` |
| classNames | 槽位类名覆盖 | `Partial<CalendarClassNames>` | `{}` |
| style | 根节点样式 | `React.CSSProperties / string` | `undefined / ''` |
| onMonthChange | 月份变化回调（React） | `(month: string) => void` | `undefined` |

### Calendar Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控值 | `string (YYYY-MM-DD)` | `''` |
| defaultValue | 非受控默认值 | `string (YYYY-MM-DD)` | `''` |
| onValueChange | 值变化回调（React） | `(value: string) => void` | `undefined` |

### CalendarRange Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控区间值 | `{ start?: string; end?: string }` | `{}` |
| defaultValue | 非受控默认区间值 | `{ start?: string; end?: string }` | `{}` |
| onValueChange | 区间变化回调（React） | `(value) => void` | `undefined` |

Events

- `change` / `valuechange`
  - 单选模式：`{ value: string }`
  - 区间模式：`{ value: { start: string; end: string } }`
- `monthchange`：`{ month: string }`

### Slots

- `base`
- `header`
- `pickerTrigger`
- `title`
- `pickerIcon`
- `panel`
- `weekRow`
- `weekCell`
- `monthList`
- `monthHeader`
- `monthBody`
- `grid`
- `dayCell`
- `dayPlaceholder`
- `dayButton`
- `dayText`
- `helper`
- `pickerBackdrop`
- `pickerOverlay`
- `pickerPanel`
- `pickerPickbox`
