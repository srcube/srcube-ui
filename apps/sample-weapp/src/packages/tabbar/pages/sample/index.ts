Page({
  data: {
    tone: 'default' as 'default' | 'dark',
    value: 'home',
    items: [
      { value: 'home', label: '首页', icon: '⌂', badge: true },
      { value: 'msg', label: '消息', icon: '✉', badge: 12 },
      { value: 'me', label: '我的', icon: '☺', badge: '99+' },
    ],
    colorItems: [
      { value: 'discover', label: '发现', icon: '⌂' },
      { value: 'notify', label: '通知', icon: '✉', badge: '99+' },
      { value: 'profile', label: '我的', icon: '☺' },
    ],
    colorCases: [
      { color: 'default', label: 'Default' },
      { color: 'primary', label: 'Primary' },
      { color: 'secondary', label: 'Secondary' },
      { color: 'success', label: 'Success' },
      { color: 'warning', label: 'Warning' },
      { color: 'danger', label: 'Danger' },
    ],
  },

  handleChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: string;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!nextValue) {
      return;
    }

    this.setData({
      value: nextValue,
    });
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
