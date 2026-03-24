import { resolveSampleTone, type SampleTone } from '../../shared/sample-theme';

type SampleApp = WechatMiniprogram.App.Instance<{
  globalData: {
    sampleTone: SampleTone;
  };
  setSampleTone?: (tone: SampleTone) => void;
  subscribeSampleTone?: (listener: (tone: SampleTone) => void) => () => void;
}>;

function resolvePageClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'min-h-screen bg-zinc-900 text-zinc-50 pb-safe'
    : 'min-h-screen bg-slate-100 text-slate-900 pb-safe';
}

function resolveSurfaceClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm shadow-black/20'
    : 'rounded-3xl border border-slate-200 bg-white p-4 shadow-sm';
}

function resolveTitleClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'text-sm font-semibold text-zinc-50'
    : 'text-sm font-semibold text-slate-900';
}

function resolveDescriptionClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'mt-1 text-xs text-zinc-400'
    : 'mt-1 text-xs text-slate-500';
}

function resolvePreviewCardClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'rounded-[32rpx] border border-zinc-800 bg-zinc-950 p-4'
    : 'rounded-[32rpx] border border-slate-200 bg-slate-50 p-4';
}

Page({
  data: {
    tone: 'default' as SampleTone,
    pageClassName: resolvePageClassName('default'),
    surfaceClassName: resolveSurfaceClassName('default'),
    titleClassName: resolveTitleClassName('default'),
    descriptionClassName: resolveDescriptionClassName('default'),
    previewCardClassName: resolvePreviewCardClassName('default'),
    toneMeta: 'Light',
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
      pageClassName: resolvePageClassName(tone),
      surfaceClassName: resolveSurfaceClassName(tone),
      titleClassName: resolveTitleClassName(tone),
      descriptionClassName: resolveDescriptionClassName(tone),
      previewCardClassName: resolvePreviewCardClassName(tone),
      toneMeta: tone === 'dark' ? 'Dark' : 'Light',
    });
  },

  onLoad() {
    const app = getApp<SampleApp>();
    const tone = resolveSampleTone(app.globalData?.sampleTone);
    this.applyTone(tone);

    this._unsubscribeTone = app.subscribeSampleTone?.((nextTone) => {
      this.applyTone(nextTone);
    }) ?? null;
  },

  onUnload() {
    this._unsubscribeTone?.();
    this._unsubscribeTone = null;
  },

  handleGoHome() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
      return;
    }

    wx.reLaunch({
      url: '/pages/index/index',
    });
  },
});
