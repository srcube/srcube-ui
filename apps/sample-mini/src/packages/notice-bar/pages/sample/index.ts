Page({
  data: {
    visible: true,
  },

  handleVisibleChange(
    event: WechatMiniprogram.CustomEvent<{
      isVisible?: boolean;
    }>,
  ) {
    this.setData({
      visible: Boolean(event.detail?.isVisible),
    });
  },
});
