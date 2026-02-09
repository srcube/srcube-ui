Page({
  data: {
    components: [
      {
        title: 'Button',
        url: '/packages/button/pages/sample/index',
      },
      {
        title: 'Checkbox',
        url: '/packages/checkbox/pages/sample/index',
      },
      {
        title: 'Radio',
        url: '/packages/radio/pages/sample/index',
      },
      {
        title: 'Scrollbox',
        url: '/packages/scrollbox/pages/sample/index',
      },
    ],
  },
  handleNavigate(e: WechatMiniprogram.TouchEvent) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },
});
