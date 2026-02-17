type PickerType = 'default' | 'calendar';
type PickerDatetimeMode = 'datetime' | 'date' | 'time';

type PickerMultiValue = Array<string | number | null>;
type DateRangeValue = {
  start: string | null;
  end: string | null;
};

function formatMultiValueText(value: PickerMultiValue) {
  const text = value
    .filter((item): item is string | number => item !== null && item !== undefined)
    .map((item) => String(item))
    .join(' / ');

  return text || 'none';
}

Page({
  data: {
    pickerType: 'default' as PickerType,
    datetimeMode: 'datetime' as PickerDatetimeMode,
    datetimeFormat: 'YYYY-MM-DD HH:mm:ss',
    singleItems: [
      { id: 'cq', label: '重庆' },
      { id: 'cd', label: '成都' },
      { id: 'sh', label: '上海' },
      { id: 'sz', label: '深圳' },
    ],
    singleValue: ['cq'] as PickerMultiValue,
    multiColumns: [
      {
        id: 'category',
        items: [
          { id: 'fruit', label: '水果' },
          { id: 'drink', label: '饮品' },
          { id: 'snack', label: '零食' },
        ],
      },
      {
        id: 'name',
        items: [
          { id: 'apple', label: '苹果' },
          { id: 'banana', label: '香蕉' },
          { id: 'orange', label: '橙子' },
        ],
      },
    ],
    multiValue: ['fruit', 'apple'] as PickerMultiValue,
    multiValueText: formatMultiValueText(['fruit', 'apple']),
    dateValue: '2026-02-13',
    timeValue: '09:30:00',
    dateRangeValue: {
      start: '2026-02-13',
      end: '2026-02-18',
    } as DateRangeValue,
    datetimeValue: '2026-02-13 09:30:00',
    datetimeRangeValue: {
      start: '2026-02-13 09:30:00',
      end: '2026-02-18 18:30:00',
    } as DateRangeValue,
  },

  handleTypeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          type?: PickerType;
        };
      };
    },
  ) {
    const nextType = event.currentTarget?.dataset?.type;
    if (!nextType) {
      return;
    }

    this.setData({
      pickerType: nextType,
    });
  },

  handleDatetimeModeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          mode?: PickerDatetimeMode;
        };
      };
    },
  ) {
    const nextMode = event.currentTarget?.dataset?.mode;
    if (!nextMode) {
      return;
    }

    let nextFormat = 'YYYY-MM-DD HH:mm:ss';
    if (nextMode === 'date') {
      nextFormat = 'YYYY/MM/DD';
    } else if (nextMode === 'time') {
      nextFormat = 'HH:mm';
    }

    this.setData({
      datetimeMode: nextMode,
      datetimeFormat: nextFormat,
    });
  },

  handleSingleValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerMultiValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      singleValue: nextValue,
    });
  },

  handleMultiValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerMultiValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      multiValue: nextValue,
      multiValueText: formatMultiValueText(nextValue),
    });
  },

  handleDateValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: string;
    }>,
  ) {
    this.setData({
      dateValue: event.detail?.value ?? '',
    });
  },

  handleTimeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: string;
    }>,
  ) {
    this.setData({
      timeValue: event.detail?.value ?? '',
    });
  },

  handleDateRangeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: DateRangeValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!nextValue) {
      return;
    }

    this.setData({
      dateRangeValue: {
        start: nextValue.start ?? null,
        end: nextValue.end ?? null,
      },
    });
  },

  handleDatetimeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: string;
    }>,
  ) {
    this.setData({
      datetimeValue: event.detail?.value ?? '',
    });
  },

  handleDatetimeRangeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: DateRangeValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!nextValue) {
      return;
    }

    this.setData({
      datetimeRangeValue: {
        start: nextValue.start ?? null,
        end: nextValue.end ?? null,
      },
    });
  },
});
