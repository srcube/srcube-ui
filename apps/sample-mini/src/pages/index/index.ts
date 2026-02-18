Page({
  data: {
    components: [
      {
        title: 'Accordion',
        url: '/packages/accordion/pages/sample/index',
      },
      {
        title: 'Action Sheet',
        url: '/packages/action-sheet/pages/sample/index',
      },
      {
        title: 'Avatar',
        url: '/packages/avatar/pages/sample/index',
      },
      {
        title: 'Cascader',
        url: '/packages/cascader/pages/sample/index',
      },
      {
        title: 'Calendar',
        url: '/packages/calendar/pages/sample/index',
      },
      {
        title: 'Collapse',
        url: '/packages/collapse/pages/sample/index',
      },
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
        title: 'Image',
        url: '/packages/image/pages/sample/index',
      },
      {
        title: 'Input',
        url: '/packages/input/pages/sample/index',
      },
      {
        title: 'Textarea',
        url: '/packages/textarea/pages/sample/index',
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
        title: 'Swipe Action',
        url: '/packages/swipe-action/pages/sample/index',
      },
      {
        title: 'Skeleton',
        url: '/packages/skeleton/pages/sample/index',
      },
      {
        title: 'Steps',
        url: '/packages/steps/pages/sample/index',
      },
      {
        title: 'Stepper',
        url: '/packages/stepper/pages/sample/index',
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
        title: 'Picker',
        url: '/packages/picker/pages/sample/index',
      },
      {
        title: 'Popover',
        url: '/packages/popover/pages/sample/index',
      },
      {
        title: 'Notice Bar',
        url: '/packages/notice-bar/pages/sample/index',
      },
      {
        title: 'Modal',
        url: '/packages/modal/pages/sample/index',
      },
      {
        title: 'Navbar',
        url: '/packages/navbar/pages/sample/index',
      },
      {
        title: 'Drawer',
        url: '/packages/drawer/pages/sample/index',
      },
      {
        title: 'Tabs',
        url: '/packages/tabs/pages/sample/index',
      },
      {
        title: 'Tabbar',
        url: '/packages/tabbar/pages/sample/index',
      },
      {
        title: 'Timeline',
        url: '/packages/timeline/pages/sample/index',
      },
      {
        title: 'Tour',
        url: '/packages/tour/pages/sample/index',
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
