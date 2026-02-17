Page({
  data: {
    isOpen: false,
  },

  handleChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      isOpen: Boolean(event.detail?.isOpen),
    });
  },
});
