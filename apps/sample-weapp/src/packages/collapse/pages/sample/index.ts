Page({
  data: {
    expanded: false,
  },

  handleChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: boolean;
    }>,
  ) {
    this.setData({
      expanded: Boolean(event.detail?.value),
    });
  },
});
