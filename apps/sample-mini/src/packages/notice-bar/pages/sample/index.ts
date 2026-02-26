Page({
  data: {
    visible: true,
    noticeItems: [
      '系统维护中，部分功能可能受影响。',
      '预计 02:30 恢复服务。',
      '如有疑问请联系值班同学。',
    ],
    switchInterval: 2600,
    marqueeDuration: 5200,
    switchIntervalOptions: [
      { label: '1.8s', value: 1800 },
      { label: '2.6s', value: 2600 },
      { label: '3.6s', value: 3600 },
    ],
    marqueeDurationOptions: [
      { label: '4.2s', value: 4200 },
      { label: '5.2s', value: 5200 },
      { label: '6.8s', value: 6800 },
    ],
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

  handleSwitchIntervalTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          value?: number;
        };
      };
    },
  ) {
    const value = Number(event.currentTarget?.dataset?.value);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.setData({
      switchInterval: value,
    });
  },

  handleMarqueeDurationTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          value?: number;
        };
      };
    },
  ) {
    const value = Number(event.currentTarget?.dataset?.value);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.setData({
      marqueeDuration: value,
    });
  },
});
