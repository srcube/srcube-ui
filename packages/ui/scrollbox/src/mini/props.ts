import type { ScrollboxClasses, ScrollboxVariants } from "../style";

export type ScrollboxMiniProps = ScrollboxVariants & {
  className?: string;
  classNames?: ScrollboxClasses;
  style?: string;

  scrollX?: boolean | null;
  scrollY?: boolean | null;
  upperThreshold?: number;
  lowerThreshold?: number;
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
  orientation: { type: null, value: "y" },
  hideMasks: { type: Boolean, value: false },

  className: String,
  classNames: Object,
  style: String,

  scrollX: { type: null, value: null },
  scrollY: { type: null, value: null },
  upperThreshold: { type: Number, value: 50 },
  lowerThreshold: { type: Number, value: 50 },
  scrollTop: { type: null, value: null },
  scrollLeft: { type: null, value: null },
  scrollIntoView: String,
  scrollWithAnimation: Boolean,
  enableBackToTop: Boolean,
  showScrollbar: { type: null, value: null },
  enhanced: Boolean,
  bounces: { type: null, value: null },
  pagingEnabled: Boolean,
  fastDeceleration: Boolean,
  enableFlex: Boolean,
  scrollAnchoring: Boolean,
  refresherEnabled: Boolean,
  refresherThreshold: Number,
  refresherDefaultStyle: String,
  refresherBackground: String,
  refresherTriggered: Boolean,
} as const;
