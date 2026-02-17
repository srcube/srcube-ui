Page({
  data: {
    value: 'home',
    items: [
      { value: 'home', label: '首页', icon: '⌂' },
      { value: 'msg', label: '消息', icon: '✉' },
      { value: 'me', label: '我的', icon: '☺' },
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
