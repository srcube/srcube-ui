import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

const inputOtpColorGroups = [
  [
    { label: 'default', value: 'default' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
  ],
  [
    { label: 'secondary', value: 'secondary' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
  ],
] as const;

type InputOtpColor = (typeof inputOtpColorGroups)[number][number]['value'];

Page({
  data: {
    tone: 'default' as SampleTone,
    value: '',
    completeValue: '',
    passwordValue: '',
    activeColor: 'default' as InputOtpColor,
    colorGroups: inputOtpColorGroups,
    colorValue: '12',
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

  handleValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      value: e.detail?.value ?? '',
    });
  },

  handleComplete(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      completeValue: e.detail?.value ?? '',
    });
  },

  handlePasswordValueChange(
    e: WechatMiniprogram.CustomEvent<{ value?: string }>,
  ) {
    this.setData({
      passwordValue: e.detail?.value ?? '',
    });
  },

  handleColorValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      colorValue: e.detail?.value ?? '',
    });
  },

  handleColorTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: InputOtpColor;
        };
      };
    },
  ) {
    const color = e.currentTarget?.dataset?.color;
    if (!color) {
      return;
    }

    this.setData({
      activeColor: color,
    });
  },
});
