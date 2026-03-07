import {
  type AddToastResult,
  addToast,
  clearToasts,
  closeToast,
  getToasts,
  showToast,
  subscribeToasts,
  type ToastTone,
  toast,
} from '@srcube-ui/mini/toaster/index';

type PageExtras = {
  _unsubscribe?: () => void;
  _manualHandle?: AddToastResult | null;
};

Page({
  data: {
    useCustomClassNames: false,
    useCustomStyle: false,
    toastCount: 0,
    latestToastId: '-',
    closedCount: 0,
    handleStatus: '-',
    snapshotText: '-',
    isSimulatingSave: false,
    customClassNames: {
      toast: 'ring-1 ring-primary/30 shadow-xl',
      title: 'tracking-wide',
      description: 'opacity-90',
      closeButton: 'bg-slate-200/70',
    },
    emptyClassNames: {},
    customStyle: 'padding-left: 16rpx; padding-right: 16rpx;',
  },

  onLoad() {
    const page = this as unknown as WechatMiniprogram.Page.Instance<
      WechatMiniprogram.IAnyObject,
      WechatMiniprogram.IAnyObject
    > &
      PageExtras;

    page._unsubscribe = subscribeToasts((items) => {
      this.setData({
        toastCount: items.length,
        latestToastId: items.length > 0 ? items[items.length - 1].id : '-',
      });
    });
  },

  onUnload() {
    const page = this as unknown as WechatMiniprogram.Page.Instance<
      WechatMiniprogram.IAnyObject,
      WechatMiniprogram.IAnyObject
    > &
      PageExtras;

    page._unsubscribe?.();
    page._unsubscribe = undefined;
    page._manualHandle = null;
  },

  toggleCustomClassNames() {
    this.setData({ useCustomClassNames: !this.data.useCustomClassNames });
  },

  toggleCustomStyle() {
    this.setData({ useCustomStyle: !this.data.useCustomStyle });
  },

  handleToneTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          tone?: ToastTone;
          label?: string;
        };
      };
    },
  ) {
    const tone = event.currentTarget?.dataset?.tone ?? 'dark';
    const label = event.currentTarget?.dataset?.label ?? tone;

    addToast({
      title: String(label),
      description: `${String(label)} tone toast`,
      tone,
    });
  },

  showIconToast() {
    addToast({
      title: 'Custom Icon',
      description: 'icon + secondary tone',
      icon: '★',
      tone: 'secondary',
    });
  },

  showCustomIdToast() {
    const id = `custom-${Date.now()}`;
    addToast({
      id,
      title: 'Custom ID',
      description: id,
      tone: 'info',
      showClose: true,
    });
  },

  showShortDurationToast() {
    addToast({
      title: 'Short duration',
      description: 'auto dismiss in 600ms',
      duration: 600,
    });
  },

  showPersistentToast() {
    addToast({
      title: 'Persistent toast',
      description: 'shouldAutoDismiss=false',
      shouldAutoDismiss: false,
      showClose: true,
    });
  },

  showOnCloseToast() {
    addToast({
      title: 'onClose callback',
      description: 'Close this toast to increase counter',
      shouldAutoDismiss: false,
      showClose: true,
      onClose: () => {
        this.setData({
          closedCount: this.data.closedCount + 1,
        });
      },
    });
  },

  showByAlias() {
    showToast({
      title: 'showToast alias',
      description: 'same as addToast',
    });
  },

  showBySuccess() {
    toast.success({
      title: 'toast.success',
      description: 'helper API',
    });
  },

  showByWarning() {
    toast.warning({
      title: 'toast.warning',
      description: 'helper API',
    });
  },

  showByError() {
    toast.error({
      title: 'toast.error',
      description: 'helper API',
    });
  },

  showByInfo() {
    toast.info({
      title: 'toast.info',
      description: 'helper API',
    });
  },

  showHandleToast() {
    const page = this as unknown as WechatMiniprogram.Page.Instance<
      WechatMiniprogram.IAnyObject,
      WechatMiniprogram.IAnyObject
    > &
      PageExtras;

    const handle = addToast({
      title: 'AddToastResult handle',
      description: 'Use close() or wait closed Promise',
      shouldAutoDismiss: false,
      showClose: true,
      tone: 'secondary',
    });

    page._manualHandle = handle;

    this.setData({
      handleStatus: `opened:${handle.id.slice(-6)}`,
      latestToastId: handle.id,
    });

    handle.closed.then(() => {
      if (page._manualHandle?.id === handle.id) {
        page._manualHandle = null;
      }

      this.setData({
        handleStatus: `closed:${handle.id.slice(-6)}`,
      });
    });
  },

  closeHandleToast() {
    const page = this as unknown as WechatMiniprogram.Page.Instance<
      WechatMiniprogram.IAnyObject,
      WechatMiniprogram.IAnyObject
    > &
      PageExtras;

    if (!page._manualHandle) {
      this.setData({ handleStatus: 'no handle' });
      return;
    }

    page._manualHandle.close();
  },

  closeLatestToast() {
    if (!this.data.latestToastId || this.data.latestToastId === '-') {
      return;
    }

    closeToast(this.data.latestToastId);
  },

  readSnapshot() {
    const snapshot = getToasts();
    this.setData({
      snapshotText:
        snapshot.length === 0
          ? '-'
          : snapshot
              .map((item) => `${item.id.slice(-6)}:${item.tone}:${item.state}`)
              .join(' | '),
    });
  },

  clearAll() {
    clearToasts();
    this.setData({
      handleStatus: 'cleared',
      snapshotText: '-',
    });
  },

  async simulateSaveFlow() {
    if (this.data.isSimulatingSave) {
      return;
    }

    this.setData({ isSimulatingSave: true });
    const handle = addToast({
      title: 'Saving...',
      description: 'Please wait',
      shouldAutoDismiss: false,
      tone: 'info',
    });

    this.setData({
      handleStatus: `saving:${handle.id.slice(-6)}`,
    });

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1200);
    });

    handle.close();
    await handle.closed;

    toast.success({
      title: 'Saved',
      description: 'The operation has completed',
    });

    this.setData({
      isSimulatingSave: false,
      handleStatus: `flow done:${handle.id.slice(-6)}`,
    });
  },
});
