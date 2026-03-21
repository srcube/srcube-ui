import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    title: '订单详情',
    titleAlign: 'center' as 'start' | 'center' | 'end',
    tone: 'default' as SampleTone,
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
    });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleTitleAlignTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          align?: 'start' | 'center' | 'end';
        };
      };
    },
  ) {
    const align = event.currentTarget?.dataset?.align;
    if (!align) {
      return;
    }

    this.setData({
      titleAlign: align,
    });
  },

  handleBack(
    event: WechatMiniprogram.CustomEvent<{
      canBack?: boolean;
    }>,
  ) {
    console.log('Navbar back', event.detail?.canBack);
  },
});
