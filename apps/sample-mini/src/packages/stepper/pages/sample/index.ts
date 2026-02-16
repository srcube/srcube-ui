const stepperColorGroups = [
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

type StepperColor = (typeof stepperColorGroups)[number][number]['value'];

Page({
  data: {
    basicValue: 2,
    activeColor: 'default' as StepperColor,
    colorValue: 3,
    colorGroups: stepperColorGroups,
  },

  handleBasicChange(e: WechatMiniprogram.CustomEvent<{ value?: number }>) {
    const value = e.detail?.value;
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return;
    }

    this.setData({
      basicValue: value,
    });
  },

  handleColorChange(e: WechatMiniprogram.CustomEvent<{ value?: number }>) {
    const value = e.detail?.value;
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return;
    }

    this.setData({
      colorValue: value,
    });
  },

  handleColorTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: StepperColor;
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
