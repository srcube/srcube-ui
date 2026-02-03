Page({
  data: {
    components: [
      {
        title: "Button",
        url: "/packages/button/pages/sample/index",
      },
    ],
  },
  handleNavigate(e: WechatMiniprogram.TouchEvent) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },
});
