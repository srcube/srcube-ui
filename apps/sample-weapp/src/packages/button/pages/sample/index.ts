import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    buttonTone: 'light' as 'light' | 'dark',
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
      buttonTone: tone === 'dark' ? 'dark' : 'light',
    });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== 'function') return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
