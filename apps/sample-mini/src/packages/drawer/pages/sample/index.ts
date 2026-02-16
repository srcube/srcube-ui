type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

Page({
  data: {
    isOpen: false,
    placement: 'right' as DrawerPlacement,
    lockedOpen: false,
  },

  openPlacement(e: WechatMiniprogram.TouchEvent) {
    const { placement } = e.currentTarget.dataset as {
      placement?: DrawerPlacement;
    };

    this.setData({
      placement: placement ?? 'right',
      isOpen: true,
    });
  },

  closePlacement() {
    this.setData({ isOpen: false });
  },

  handleOpenChange(e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>) {
    this.setData({ isOpen: e.detail.isOpen });
  },

  openLocked() {
    this.setData({ lockedOpen: true });
  },

  closeLocked() {
    this.setData({ lockedOpen: false });
  },

  handleLockedOpenChange(
    e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>,
  ) {
    this.setData({ lockedOpen: e.detail.isOpen });
  },
});
