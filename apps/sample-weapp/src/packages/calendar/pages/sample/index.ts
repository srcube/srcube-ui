import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    singleValue: '2026-02-18',
    rangeValue: {
      start: '2026-02-10',
      end: '2026-02-18',
    },
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

  handleSingleValueChange(event: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = event.detail?.value ?? '';
    this.setData({
      singleValue: value,
    });
  },

  handleRangeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: { start?: string; end?: string };
    }>,
  ) {
    const value = event.detail?.value ?? {};
    this.setData({
      rangeValue: {
        start: value.start ?? '',
        end: value.end ?? '',
      },
    });
  },
});
