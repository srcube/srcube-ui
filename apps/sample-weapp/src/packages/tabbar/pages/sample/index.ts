Page({
  data: {
    value: 'home',
    items: [
      { value: 'home', label: '首页', icon: '⌂', badge: true },
      { value: 'msg', label: '消息', icon: '✉', badge: 12 },
      { value: 'me', label: '我的', icon: '☺', badge: '99+' },
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
});
