import type { UploaderFile } from '@srcube-ui/mini/uploader/index';
import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    value: [] as UploaderFile[],
    message: '请选择图片',
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

  handleValueChange(
    event: WechatMiniprogram.CustomEvent<{ value?: UploaderFile[] }>,
  ) {
    const value = Array.isArray(event.detail?.value) ? event.detail.value : [];
    this.setData({
      value,
      message: `当前 ${value.length} 张`,
    });
  },

  handleExceed(
    event: WechatMiniprogram.CustomEvent<{
      acceptedCount?: number;
      rejectedCount?: number;
    }>,
  ) {
    const acceptedCount = Number(event.detail?.acceptedCount ?? 0);
    const rejectedCount = Number(event.detail?.rejectedCount ?? 0);
    this.setData({
      message: `超出限制：接受 ${acceptedCount}，拒绝 ${rejectedCount}`,
    });
  },
});
