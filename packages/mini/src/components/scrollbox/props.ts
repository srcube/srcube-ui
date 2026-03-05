import type { ScrollboxClasses, ScrollboxVariants } from '@srcube-ui/styles/components/scrollbox/style';

export type ScrollboxMiniProps = ScrollboxVariants & {
  className?: string;
  classNames?: ScrollboxClasses;
  style?: string;

  scrollX?: boolean | null;
  scrollY?: boolean | null;
  upperThreshold?: number;
  lowerThreshold?: number;
  scrollEndDelay?: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollIntoView?: string;
  scrollWithAnimation?: boolean;
  enableBackToTop?: boolean;
  showScrollbar?: boolean | null;
  enhanced?: boolean;
  bounces?: boolean | null;
  pagingEnabled?: boolean;
  fastDeceleration?: boolean;
  enableFlex?: boolean;
  scrollAnchoring?: boolean;
  refresherEnabled?: boolean;
  refresherThreshold?: number;
  refresherDefaultStyle?: string;
  refresherBackground?: string;
  refresherTriggered?: boolean;
};

export const scrollboxMiniProps = {
  orientation: { type: null, value: 'y' },
  hideMasks: { type: Boolean, value: false },

  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },

  scrollX: { type: null, value: null },
  scrollY: { type: null, value: null },
  upperThreshold: { type: Number, value: 50 },
  lowerThreshold: { type: Number, value: 50 },
  scrollEndDelay: { type: Number, value: 120 },
  scrollTop: { type: null, value: null },
  scrollLeft: { type: null, value: null },
  scrollIntoView: { type: String, value: '' },
  scrollWithAnimation: { type: Boolean, value: false },
  enableBackToTop: { type: Boolean, value: false },
  showScrollbar: { type: null, value: null },
  enhanced: { type: Boolean, value: false },
  bounces: { type: null, value: null },
  pagingEnabled: { type: Boolean, value: false },
  fastDeceleration: { type: Boolean, value: false },
  enableFlex: { type: Boolean, value: false },
  scrollAnchoring: { type: Boolean, value: false },
  refresherEnabled: { type: Boolean, value: false },
  refresherThreshold: { type: Number, value: 45 },
  refresherDefaultStyle: { type: String, value: 'black' },
  refresherBackground: { type: String, value: '#FFF' },
  refresherTriggered: { type: Boolean, value: false },
} as const;
