Page({
  data: {
    basicOpen: false,
    backdropOpen: false,
    backdropValue: 'opaque',
    lockedOpen: false,
    noBackdropOpen: false,
  },
  openBasic() {
    this.setData({ basicOpen: true });
  },
  closeBasic() {
    this.setData({ basicOpen: false });
  },
  handleBasicChange(e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>) {
    this.setData({ basicOpen: e.detail.isOpen });
  },
  openBackdrop(e: WechatMiniprogram.TouchEvent) {
    const { backdrop } = e.currentTarget.dataset as { backdrop?: string };
    this.setData({
      backdropValue: backdrop ?? 'opaque',
      backdropOpen: true,
    });
  },
  closeBackdrop() {
    this.setData({ backdropOpen: false });
  },
  handleBackdropChange(e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>) {
    this.setData({ backdropOpen: e.detail.isOpen });
  },
  openLocked() {
    this.setData({ lockedOpen: true });
  },
  closeLocked() {
    this.setData({ lockedOpen: false });
  },
  handleLockedChange(e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>) {
    this.setData({ lockedOpen: e.detail.isOpen });
  },
  openNoBackdrop() {
    this.setData({ noBackdropOpen: true });
  },
  closeNoBackdrop() {
    this.setData({ noBackdropOpen: false });
  },
  handleNoBackdropChange(
    e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>,
  ) {
    this.setData({ noBackdropOpen: e.detail.isOpen });
  },
});
