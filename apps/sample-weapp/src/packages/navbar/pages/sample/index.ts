Page({
  data: {
    title: '订单详情',
    titleAlign: 'center' as 'start' | 'center' | 'end',
  },

  handleTitleAlignTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          align?: 'start' | 'center' | 'end';
        };
      };
    },
  ) {
    const align = event.currentTarget?.dataset?.align;
    if (!align) {
      return;
    }

    this.setData({
      titleAlign: align,
    });
  },

  handleBack(
    event: WechatMiniprogram.CustomEvent<{
      canBack?: boolean;
    }>,
  ) {
    console.log('Navbar back', event.detail?.canBack);
  },
});
