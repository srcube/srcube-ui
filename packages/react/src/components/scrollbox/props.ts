import type * as React from 'react';

type ScrollboxOrientation = 'x' | 'y' | 'xy';

type ScrollboxClassNames = {
  wrapper?: string;
  scrollview?: string;
  content?: string;
  maskTop?: string;
  maskBottom?: string;
  maskLeft?: string;
  maskRight?: string;
};

export type ScrollboxScrollDetail = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};

export type ScrollboxReactProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onScroll'
> & {
  orientation?: ScrollboxOrientation | null;
  hideMasks?: boolean;
  classNames?: ScrollboxClassNames;

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

  onScroll?: React.UIEventHandler<HTMLDivElement>;
  onScrollEnd?: (detail: ScrollboxScrollDetail) => void;
  onScrollToUpper?: React.UIEventHandler<HTMLDivElement>;
  onScrollToLower?: React.UIEventHandler<HTMLDivElement>;
  scrollRef?: React.Ref<HTMLDivElement>;
  overlay?: React.ReactNode;
};
