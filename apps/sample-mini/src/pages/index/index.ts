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
        title: 'Field',
        url: '/packages/field/pages/sample/index',
      },
      {
        title: 'Radio',
        url: '/packages/radio/pages/sample/index',
      },
      {
        title: 'Switch',
        url: '/packages/switch/pages/sample/index',
      },
      {
        title: 'Input OTP',
        url: '/packages/input-otp/pages/sample/index',
      },
      {
        title: 'Listbox',
        url: '/packages/listbox/pages/sample/index',
      },
      {
        title: 'Pickbox',
        url: '/packages/pickbox/pages/sample/index',
      },
      {
        title: 'Modal',
        url: '/packages/modal/pages/sample/index',
      },
      {
        title: 'Tabs',
        url: '/packages/tabs/pages/sample/index',
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
