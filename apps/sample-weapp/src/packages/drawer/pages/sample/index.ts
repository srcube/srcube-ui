type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

Page({
  data: {
    isOpen: false,
    placement: 'right' as DrawerPlacement,
    lockedOpen: false,
    topActionDrawerOpen: false,
    topActionSheetOpen: false,
    topActionResult: '-',
    topActionSheetActions: [
      {
        value: 'copy',
        label: '复制链接',
        description: '复制当前内容链接',
      },
      {
        value: 'share',
        label: '分享给团队',
        description: '发送给协作者',
      },
      {
        value: 'archive',
        label: '归档',
        description: '完成后归档到历史记录',
      },
    ],
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

  openTopActionScene() {
    this.setData({
      topActionDrawerOpen: true,
    });
  },

  closeTopActionDrawer() {
    this.setData({
      topActionDrawerOpen: false,
      topActionSheetOpen: false,
    });
  },

  handleTopActionDrawerChange(
    e: WechatMiniprogram.CustomEvent<{ isOpen: boolean }>,
  ) {
    const nextOpen = Boolean(e.detail.isOpen);
    this.setData({
      topActionDrawerOpen: nextOpen,
      ...(nextOpen ? {} : { topActionSheetOpen: false }),
    });
  },

  openTopActionSheet() {
    this.setData({
      topActionSheetOpen: true,
    });
  },

  handleTopActionSheetChange(
    e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean }>,
  ) {
    this.setData({
      topActionSheetOpen: Boolean(e.detail?.isOpen),
    });
  },

  handleTopActionSheetAction(
    e: WechatMiniprogram.CustomEvent<{
      value?: string | number;
    }>,
  ) {
    this.setData({
      topActionResult: String(e.detail?.value ?? '-'),
      topActionSheetOpen: false,
    });
  },
});
