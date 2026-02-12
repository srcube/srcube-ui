type PickboxMiniColumn = {
  id: string;
  items: Array<{
    id: string | number;
    label: string;
    isDisabled?: boolean;
  }>;
};

const pickboxColorGroups = [
  [
    { label: 'default', value: 'default' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
  ],
  [
    { label: 'secondary', value: 'secondary' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
  ],
] as const;

type PickboxColor = (typeof pickboxColorGroups)[number][number]['value'];

function createColumns(): PickboxMiniColumn[] {
  return [
    {
      id: 'year',
      items: Array.from({ length: 36 }, (_, index) => {
        const year = 1990 + index;
        return {
          id: year,
          label: `${year} 年`,
        };
      }),
    },
    {
      id: 'month',
      items: Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        label: `${index + 1} 月`,
      })),
    },
    {
      id: 'day',
      items: Array.from({ length: 31 }, (_, index) => {
        const day = index + 1;
        return {
          id: day,
          label: `${day} 日`,
          isDisabled: day % 7 === 0,
        };
      }),
    },
  ];
}

Page({
  data: {
    columns: createColumns(),
    value: [2000, 1, 1],
    activeColor: 'default' as PickboxColor,
    colorValue: [2000, 1, 1],
    colorGroups: pickboxColorGroups,
  },

  handleValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value: Array<string | number | null>;
      columnIndex: number;
      itemId: string | number;
    }>,
  ) {
    this.setData({
      value: event.detail.value,
    });
  },

  handleColorValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value: Array<string | number | null>;
    }>,
  ) {
    this.setData({
      colorValue: event.detail.value,
    });
  },

  handleColorTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: PickboxColor;
        };
      };
    },
  ) {
    const nextColor = event.currentTarget?.dataset?.color;
    if (!nextColor) return;

    this.setData({
      activeColor: nextColor,
    });
  },
});
