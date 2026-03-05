Page({
  data: {},
  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== 'function') return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
