import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

type StepSize = 'sm' | 'md' | 'lg';
type StepColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';
type StepVariant = 'solid' | 'outline' | 'flat' | 'text' | 'twotone';

const stepColorGroups = [
  [
    { label: 'default', value: 'default' as StepColor },
    { label: 'primary', value: 'primary' as StepColor },
    { label: 'success', value: 'success' as StepColor },
  ],
  [
    { label: 'secondary', value: 'secondary' as StepColor },
    { label: 'warning', value: 'warning' as StepColor },
    { label: 'danger', value: 'danger' as StepColor },
  ],
] as const;

Page({
  data: {
    tone: 'default' as SampleTone,
    globalSize: 'md' as StepSize,
    globalColor: 'primary' as StepColor,
    globalVariant: 'solid' as StepVariant,
    sizeOptions: [
      { label: 'sm', value: 'sm' as StepSize },
      { label: 'md', value: 'md' as StepSize },
      { label: 'lg', value: 'lg' as StepSize },
    ],
    variantOptionsFirst: [
      { label: 'solid', value: 'solid' as StepVariant },
      { label: 'outline', value: 'outline' as StepVariant },
      { label: 'flat', value: 'flat' as StepVariant },
    ],
    variantOptionsSecond: [
      { label: 'text', value: 'text' as StepVariant },
      { label: 'twotone', value: 'twotone' as StepVariant },
    ],
    stepColorGroups,
    checkoutSteps: [
      { title: 'Address', description: 'Fill shipping info' },
      {
        title: 'Payment',
        description: 'Confirm card details\nand billing address',
      },
      { title: 'Done', description: 'Order created' },
    ],
    issueSteps: [
      { title: 'Create ticket', description: 'Submit detail', status: 'finish' },
      { title: 'Assign owner', description: 'Waiting owner', status: 'error' },
      { title: 'Fix & verify', description: 'Pending' },
    ],
    noDescriptionSteps: [
      { title: 'Plan' },
      { title: 'Build' },
      { title: 'Release' },
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

  handleGlobalSizeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          size?: StepSize;
        };
      };
    },
  ) {
    const nextSize = event.currentTarget?.dataset?.size;
    if (!nextSize) {
      return;
    }

    this.setData({
      globalSize: nextSize,
    });
  },

  handleGlobalColorTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: StepColor;
        };
      };
    },
  ) {
    const nextColor = event.currentTarget?.dataset?.color;
    if (!nextColor) {
      return;
    }

    this.setData({
      globalColor: nextColor,
    });
  },

  handleGlobalVariantTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          variant?: StepVariant;
        };
      };
    },
  ) {
    const nextVariant = event.currentTarget?.dataset?.variant;
    if (!nextVariant) {
      return;
    }

    this.setData({
      globalVariant: nextVariant,
    });
  },
});
