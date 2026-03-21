import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    isOpen: false,
    customOpen: false,
    footerOpen: false,
    cancelPropsOpen: false,
    sizeSmOpen: false,
    sizeMdOpen: false,
    sizeLgOpen: false,
    result: '-',
    cancelButtonProps: {
      color: 'danger',
      variant: 'flat',
      className: 'font-semibold',
    },
    actions: [
      {
        value: 'edit',
        label: 'Edit',
        description: 'Update current content',
      },
      {
        value: 'share',
        label: 'Share',
        description: 'Share with teammates',
      },
      {
        value: 'delete',
        label: 'Delete',
        description: 'This action cannot be undone',
        color: 'danger',
      },
    ],
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({ tone });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleOpen() {
    this.setData({
      isOpen: true,
    });
  },

  handleOpenCustom() {
    this.setData({
      customOpen: true,
    });
  },

  handleOpenFooter() {
    this.setData({
      footerOpen: true,
    });
  },

  handleOpenCancelProps() {
    this.setData({
      cancelPropsOpen: true,
    });
  },

  handleFooterLater() {
    this.setData({
      result: 'later',
      footerOpen: false,
    });
  },

  handleFooterDismiss() {
    this.setData({
      result: 'dismiss',
      footerOpen: false,
    });
  },

  handleOpenSizeSm() {
    this.setData({
      sizeSmOpen: true,
    });
  },

  handleOpenSizeMd() {
    this.setData({
      sizeMdOpen: true,
    });
  },

  handleOpenSizeLg() {
    this.setData({
      sizeLgOpen: true,
    });
  },

  handleChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      isOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleCustomChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      customOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleSizeSmChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      sizeSmOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleSizeMdChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      sizeMdOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleSizeLgChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      sizeLgOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleFooterChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      footerOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleCancelPropsChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      cancelPropsOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleAction(
    event: WechatMiniprogram.CustomEvent<{
      value?: string | number;
    }>,
  ) {
    this.setData({
      result: String(event.detail?.value ?? '-'),
    });
  },
});
