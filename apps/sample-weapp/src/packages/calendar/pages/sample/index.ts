Page({
  data: {
    singleValue: '2026-02-18',
    rangeValue: {
      start: '2026-02-10',
      end: '2026-02-18',
    },
  },

  handleSingleValueChange(event: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = event.detail?.value ?? '';
    this.setData({
      singleValue: value,
    });
  },

  handleRangeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: { start?: string; end?: string };
    }>,
  ) {
    const value = event.detail?.value ?? {};
    this.setData({
      rangeValue: {
        start: value.start ?? '',
        end: value.end ?? '',
      },
    });
  },
});
