const fieldColorGroups = [
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

type FieldColor = (typeof fieldColorGroups)[number][number]['value'];

Page({
  data: {
    basicValue: '',
    activeColor: 'default' as FieldColor,
    colorValue: '123456',
    colorGroups: fieldColorGroups,
  },

  handleBasicInput(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      basicValue: e.detail?.value ?? '',
    });
  },

  handleBasicValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      basicValue: e.detail?.value ?? '',
    });
  },

  handleBasicClear() {
    this.setData({
      basicValue: '',
    });
  },

  handleColorInput(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      colorValue: e.detail?.value ?? '',
    });
  },

  handleColorValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      colorValue: e.detail?.value ?? '',
    });
  },

  handleColorClear() {
    this.setData({
      colorValue: '',
    });
  },

  handleColorTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: FieldColor;
        };
      };
    },
  ) {
    const color = e.currentTarget?.dataset?.color;
    if (!color) {
      return;
    }

    this.setData({
      activeColor: color,
    });
  },
});
