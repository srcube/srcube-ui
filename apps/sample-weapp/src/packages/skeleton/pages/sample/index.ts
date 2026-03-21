import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    isLoaded: false,
    isCardLoaded: false,
    radiusOptions: [
      { label: 'none', value: 'none' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'full', value: 'full' },
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

  toggleLoaded() {
    this.setData({
      isLoaded: !this.data.isLoaded,
    });
  },

  toggleCardLoaded() {
    this.setData({
      isCardLoaded: !this.data.isCardLoaded,
    });
  },
});
