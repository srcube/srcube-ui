Page({
  data: {
    tone: 'light' as 'light' | 'dark',
    toneItems: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
  },
  handleToneChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = e.detail?.value;
    if (value !== 'light' && value !== 'dark') {
      return;
    }

    this.setData({
      tone: value,
    });
  },
  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== 'function') return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
