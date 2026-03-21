import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    expanded: false,
    tone: 'default' as SampleTone,
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

  handleChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: boolean;
    }>,
  ) {
    this.setData({
      expanded: Boolean(event.detail?.value),
    });
  },
});
