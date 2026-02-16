type PickerType = 'default' | 'calendar';

type PickerSingleValue = string | number | null;
type PickerMultiValue = Array<string | number | null>;

Page({
  data: {
    pickerType: 'default' as PickerType,
    singleItems: [
      { id: 'cq', label: '重庆' },
      { id: 'cd', label: '成都' },
      { id: 'sh', label: '上海' },
      { id: 'sz', label: '深圳' },
    ],
    singleValue: 'cq' as PickerSingleValue,
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
    dateValue: '2026-02-13',
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

  handleSingleValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerSingleValue;
    }>,
  ) {
    this.setData({
      singleValue: event.detail?.value ?? null,
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
});
