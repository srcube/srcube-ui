const inputOtpColorGroups = [
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

type InputOtpColor = (typeof inputOtpColorGroups)[number][number]['value'];

Page({
  data: {
    value: '',
    completeValue: '',
    passwordValue: '',
    activeColor: 'default' as InputOtpColor,
    colorGroups: inputOtpColorGroups,
    colorValue: '12',
  },

  handleValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      value: e.detail?.value ?? '',
    });
  },

  handleComplete(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      completeValue: e.detail?.value ?? '',
    });
  },

  handlePasswordValueChange(
    e: WechatMiniprogram.CustomEvent<{ value?: string }>,
  ) {
    this.setData({
      passwordValue: e.detail?.value ?? '',
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
          color?: InputOtpColor;
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
