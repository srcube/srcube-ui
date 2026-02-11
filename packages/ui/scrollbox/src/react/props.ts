import type * as React from 'react';
import type { ScrollboxClasses, ScrollboxVariants } from '../style';

export type ScrollboxReactProps = ScrollboxVariants &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll'> & {
    classNames?: ScrollboxClasses;

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

    onScroll?: React.UIEventHandler<HTMLDivElement>;
    onScrollToUpper?: React.UIEventHandler<HTMLDivElement>;
    onScrollToLower?: React.UIEventHandler<HTMLDivElement>;
    scrollRef?: React.Ref<HTMLDivElement>;
    overlay?: React.ReactNode;
  };
