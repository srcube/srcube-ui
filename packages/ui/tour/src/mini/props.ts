import type { TourMiniClassNames, TourVariants } from '../style';

export type TourMiniPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type TourMiniStepId = string | number;

export type TourMiniStep = {
  id?: TourMiniStepId;
  selector: string;
  title?: string;
  description?: string;
  placement?: TourMiniPlacement;
  padding?: number;
  radius?: number;
  offset?: number;
  canInteractWithTarget?: boolean;
  showSkip?: boolean;
  prevText?: string;
  nextText?: string;
  finishText?: string;
};

export type TourMiniProps = TourVariants & {
  isOpen?: boolean | null;
  defaultOpen?: boolean;
  steps?: TourMiniStep[];
  currentStep?: number | null;
  initialStep?: number;
  autoScroll?: boolean;
  scrollOffset?: number;
  scrollDuration?: number;
  lockPageScroll?: boolean;
  missingTargetStrategy?: 'skip' | 'abort' | 'wait';
  canMaskClose?: boolean;
  canBackdropClose?: boolean;
  canShowProgress?: boolean;
  canShowSkip?: boolean;
  canShowPrev?: boolean;
  canShowNext?: boolean;
  skipText?: string;
  prevText?: string;
  nextText?: string;
  finishText?: string;
  className?: string;
  classNames?: Partial<TourMiniClassNames>;
  style?: string;
};

export const tourMiniProps = {
  tone: { type: null, value: 'default' },
  isOpen: { type: null, value: null },
  defaultOpen: { type: Boolean, value: false },
  steps: { type: Array, value: [] },
  currentStep: { type: null, value: null },
  initialStep: { type: Number, value: 0 },
  autoScroll: { type: Boolean, value: true },
  scrollOffset: { type: Number, value: 96 },
  scrollDuration: { type: Number, value: 220 },
  lockPageScroll: { type: Boolean, value: true },
  missingTargetStrategy: { type: String, value: 'skip' },
  canMaskClose: { type: Boolean, value: true },
  canBackdropClose: { type: Boolean, value: false },
  canShowProgress: { type: Boolean, value: true },
  canShowSkip: { type: Boolean, value: true },
  canShowPrev: { type: Boolean, value: true },
  canShowNext: { type: Boolean, value: true },
  skipText: { type: String, value: '跳过' },
  prevText: { type: String, value: '上一步' },
  nextText: { type: String, value: '下一步' },
  finishText: { type: String, value: '完成' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
