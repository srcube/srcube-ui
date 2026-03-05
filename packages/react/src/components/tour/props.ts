import type * as React from 'react';
import type { TourReactClassNames, TourVariants } from '@srcube-ui/styles/components/tour';

export type TourPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type TourStepId = string | number;

export type TourStep = {
  id?: TourStepId;
  selector: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  placement?: TourPlacement;
  padding?: number;
  radius?: number;
  offset?: number;
  canInteractWithTarget?: boolean;
  showSkip?: boolean;
  prevText?: React.ReactNode;
  nextText?: React.ReactNode;
  finishText?: React.ReactNode;
};

export type TourOpenChangeDetail = {
  reason: string;
};

export type TourStepChangeDetail = {
  reason: string;
  step: TourStep | null;
  stepIndex: number;
};

export type TourSkipDetail = {
  step: TourStep | null;
  stepIndex: number;
};

export type TourFinishDetail = {
  step: TourStep | null;
  stepIndex: number;
};

export type TourTargetNotFoundDetail = {
  step: TourStep;
  stepIndex: number;
  selector: string;
  strategy: 'skip' | 'abort' | 'wait';
  reason: string;
};

type TourNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | 'onChange'
>;

export type TourReactProps = TourVariants &
  TourNativeProps & {
    isOpen?: boolean | null;
    defaultOpen?: boolean;
    steps?: TourStep[];
    currentStep?: number | null;
    initialStep?: number;
    autoScroll?: boolean;
    scrollOffset?: number;
    scrollDuration?: number;
    missingTargetStrategy?: 'skip' | 'abort' | 'wait';
    canMaskClose?: boolean;
    canBackdropClose?: boolean;
    canShowProgress?: boolean;
    canShowSkip?: boolean;
    canShowPrev?: boolean;
    canShowNext?: boolean;
    skipText?: React.ReactNode;
    prevText?: React.ReactNode;
    nextText?: React.ReactNode;
    finishText?: React.ReactNode;
    className?: string;
    classNames?: Partial<TourReactClassNames>;
    style?: React.CSSProperties | string;
    onOpenChange?: (isOpen: boolean, detail: TourOpenChangeDetail) => void;
    onStepChange?: (
      stepIndex: number,
      step: TourStep | null,
      detail: TourStepChangeDetail,
    ) => void;
    onSkip?: (detail: TourSkipDetail) => void;
    onFinish?: (detail: TourFinishDetail) => void;
    onTargetNotFound?: (detail: TourTargetNotFoundDetail) => void;
  };

export type TourRef = HTMLDivElement & {
  isOpen: boolean;
  stepIndex: number;
  start: (stepIndex?: number) => void;
  open: (stepIndex?: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  goTo: (stepIndex: number) => void;
  skip: () => void;
};
