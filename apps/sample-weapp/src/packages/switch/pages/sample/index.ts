Page({
  data: {
    colorValue: 'primary',
    sizeValue: 'md',
    isEnabled: true,
    colors: [
      { label: 'Default', value: 'default' },
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Danger', value: 'danger' },
    ],
    sizes: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
  },
  handleColorChange(e: WechatMiniprogram.CustomEvent) {
    const { isSelected } = e.detail || {};
    const { value } = e.currentTarget.dataset;

    if (!isSelected || typeof value !== 'string') return;
    this.setData({ colorValue: value });
  },
  handleSizeChange(e: WechatMiniprogram.CustomEvent) {
    const { isSelected } = e.detail || {};
    const { value } = e.currentTarget.dataset;

    if (!isSelected || typeof value !== 'string') return;
    this.setData({ sizeValue: value });
  },
  handleEnabledChange(e: WechatMiniprogram.CustomEvent) {
    const { isSelected } = e.detail || {};
    this.setData({ isEnabled: Boolean(isSelected) });
  },
  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== 'function') return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
