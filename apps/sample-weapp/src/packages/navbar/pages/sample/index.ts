Page({
  data: {
    title: '订单详情',
    titleAlign: 'center' as 'start' | 'center' | 'end',
    tone: 'default' as 'default' | 'dark',
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

  handleToneTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          tone?: 'default' | 'dark';
        };
      };
    },
  ) {
    const tone = event.currentTarget?.dataset?.tone;
    if (!tone) {
      return;
    }

    this.setData({
      tone,
    });
  },
});
