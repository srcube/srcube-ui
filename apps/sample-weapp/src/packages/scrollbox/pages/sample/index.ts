import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    items: Array.from({ length: 10 }, (_, index) => ({
      id: index,
      label: `Item ${index + 1}`,
    })),
    cards: Array.from({ length: 8 }, (_, index) => ({
      id: index,
      label: `Card ${index + 1}`,
    })),
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
});
