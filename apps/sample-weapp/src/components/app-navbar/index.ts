import { updateGlobalSampleTone } from '../../shared/sample-theme-page';
import { resolveSampleTone, type SampleTone } from '../../shared/sample-theme';

Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    tone: {
      type: String,
      value: 'default',
    },
    withBack: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    isToneSheetOpen: false,
    toneActions: [
      {
        value: 'default',
        label: 'Light',
        description: 'Bright surfaces for daytime preview',
      },
      {
        value: 'dark',
        label: 'Dark',
        description: 'Zinc-based dark surfaces for night preview',
      },
    ],
  },

  methods: {
    handleOpenToneSheet() {
      this.setData({
        isToneSheetOpen: true,
      });
    },

    handleToneSheetChange(
      event: WechatMiniprogram.CustomEvent<{ isOpen?: boolean }>,
    ) {
      this.setData({
        isToneSheetOpen: Boolean(event.detail?.isOpen),
      });
    },

    handleToneAction(
      event: WechatMiniprogram.CustomEvent<{ value?: SampleTone }>,
    ) {
      const tone = resolveSampleTone(event.detail?.value);
      updateGlobalSampleTone(tone);
      this.setData({
        isToneSheetOpen: false,
      });
    },
  },
});
