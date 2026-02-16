const textareaColorGroups = [
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

type TextareaColor = (typeof textareaColorGroups)[number][number]['value'];

Page({
  data: {
    basicValue: '',
    autoValue: 'A longer content for preview',
    activeColor: 'default' as TextareaColor,
    colorValue: 'Textarea preview',
    colorGroups: textareaColorGroups,
  },

  handleBasicValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      basicValue: e.detail?.value ?? '',
    });
  },

  handleAutoValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      autoValue: e.detail?.value ?? '',
    });
  },

  handleColorValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      colorValue: e.detail?.value ?? '',
    });
  },

  handleColorTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: TextareaColor;
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
