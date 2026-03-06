Page({
  data: {
    colorValue: 'primary',
    sizeValue: 'md',
    groupValue: 'left',
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
    const { value } = e.detail || {};
    if (!value) return;
    this.setData({ colorValue: value });
  },
  handleSizeChange(e: WechatMiniprogram.CustomEvent) {
    const { value } = e.detail || {};
    if (!value) return;
    this.setData({ sizeValue: value });
  },
  handleGroupChange(e: WechatMiniprogram.CustomEvent) {
    const { value } = e.detail || {};
    if (!value) return;
    this.setData({ groupValue: value });
  },
  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== 'function') return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
