Page({
  data: {
    avatarUrl: 'https://picsum.photos/120',
    tone: 'default' as 'default' | 'dark',
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
