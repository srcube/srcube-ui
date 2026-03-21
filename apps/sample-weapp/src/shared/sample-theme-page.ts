import {
  resolveSampleTone,
  type SampleTone,
} from './sample-theme';

type SampleApp = WechatMiniprogram.App.Instance<{
  globalData: {
    sampleTone: SampleTone;
  };
  setSampleTone?: (tone: SampleTone) => void;
  subscribeSampleTone?: (listener: (tone: SampleTone) => void) => () => void;
}>;

export type SampleTonePageInstance = WechatMiniprogram.Page.Instance<
  Record<string, unknown>
> & {
  _unsubscribeTone?: null | (() => void);
  applyTone?: (tone: SampleTone) => void;
};

export function attachSampleTone(page: SampleTonePageInstance) {
  const app = getApp<SampleApp>();
  const tone = resolveSampleTone(app.globalData?.sampleTone);
  page.applyTone?.(tone);
  page._unsubscribeTone = app.subscribeSampleTone?.((nextTone) => {
    page.applyTone?.(nextTone);
  }) ?? null;
}

export function detachSampleTone(page: SampleTonePageInstance) {
  page._unsubscribeTone?.();
  page._unsubscribeTone = null;
}

export function updateGlobalSampleTone(tone: SampleTone) {
  const app = getApp<SampleApp>();
  app.setSampleTone?.(resolveSampleTone(tone));
}
