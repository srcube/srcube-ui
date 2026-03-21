import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

const textareaColorGroups = [
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

type TextareaColor = (typeof textareaColorGroups)[number][number]['value'];

Page({
  data: {
    tone: 'default' as SampleTone,
    basicValue: '',
    autoValue: 'A longer content for preview',
    activeColor: 'default' as TextareaColor,
    colorValue: 'Textarea preview',
    colorGroups: textareaColorGroups,
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

  handleBasicValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      basicValue: e.detail?.value ?? '',
    });
  },

  handleAutoValueChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    this.setData({
      autoValue: e.detail?.value ?? '',
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
          color?: TextareaColor;
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
