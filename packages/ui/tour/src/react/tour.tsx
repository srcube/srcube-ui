import { Button } from '@srcube-ui/button/react';
import {
  Modal,
  ModalContent,
  type ModalClassNames,
} from '@srcube-ui/modal/react';
import * as React from 'react';
import { tour } from '../style';
import type {
  TourPlacement,
  TourReactProps,
  TourRef,
  TourStep,
} from './props';

type TargetRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type ViewportRect = {
  width: number;
  height: number;
  scrollTop: number;
};

type SpotlightRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  centerX: number;
  centerY: number;
  radius: number;
};

type TourLayoutState = {
  maskTopStyle: React.CSSProperties;
  maskLeftStyle: React.CSSProperties;
  maskRightStyle: React.CSSProperties;
  maskBottomStyle: React.CSSProperties;
  highlightStyle: React.CSSProperties;
  targetBlockerStyle: React.CSSProperties;
  popoverStyle: React.CSSProperties;
};

const DEFAULT_SPOTLIGHT_PADDING = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 12;
const DEFAULT_POPOVER_OFFSET = 12;
const DEFAULT_POPOVER_WIDTH = 320;
const DEFAULT_POPOVER_ESTIMATED_HEIGHT = 176;
const DEFAULT_EDGE_GAP = 12;
const WAIT_RETRY_MAX = 5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeNumber(value: unknown, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function normalizeSteps(rawSteps: unknown): TourStep[] {
  if (!Array.isArray(rawSteps)) {
    return [];
  }

  return rawSteps
    .map((rawStep) => {
      if (!rawStep || typeof rawStep !== 'object') {
        return null;
      }

      const step = rawStep as TourStep;
      if (typeof step.selector !== 'string' || !step.selector.trim()) {
        return null;
      }

      return {
        id: step.id,
        selector: step.selector.trim(),
        title: step.title,
        description: step.description,
        placement: step.placement ?? 'auto',
        padding: normalizeNumber(step.padding, DEFAULT_SPOTLIGHT_PADDING),
        radius: normalizeNumber(step.radius, DEFAULT_SPOTLIGHT_RADIUS),
        offset: normalizeNumber(step.offset, DEFAULT_POPOVER_OFFSET),
        canInteractWithTarget: step.canInteractWithTarget !== false,
        showSkip: step.showSkip,
        prevText: step.prevText,
        nextText: step.nextText,
        finishText: step.finishText,
      } satisfies TourStep;
    })
    .filter((step): step is TourStep => Boolean(step));
}

function normalizePlacement(value?: string | null): TourPlacement {
  if (
    value === 'top'
    || value === 'bottom'
    || value === 'left'
    || value === 'right'
  ) {
    return value;
  }

  return 'auto';
}

function resolveTargetRect(rawRect?: DOMRect | null): TargetRect | null {
  if (!rawRect) {
    return null;
  }

  const width = Number(rawRect.width ?? 0);
  const height = Number(rawRect.height ?? 0);
  const left = Number(rawRect.left ?? 0);
  const top = Number(rawRect.top ?? 0);
  const right = Number(rawRect.right ?? left + width);
  const bottom = Number(rawRect.bottom ?? top + height);

  if (
    !Number.isFinite(width)
    || !Number.isFinite(height)
    || width <= 0
    || height <= 0
  ) {
    return null;
  }

  return {
    left,
    top,
    width,
    height,
    right,
    bottom,
  };
}

function resolveViewportRect(): ViewportRect {
  const width = Math.max(0, Number(window.innerWidth || 0));
  const height = Math.max(0, Number(window.innerHeight || 0));
  const scrollTop = Math.max(
    0,
    Number(window.scrollY || document.documentElement.scrollTop || 0),
  );

  return {
    width,
    height,
    scrollTop,
  };
}

function resolveSpotlightRect(params: {
  targetRect: TargetRect;
  viewport: ViewportRect;
  padding: number;
  radius: number;
}): SpotlightRect {
  const { targetRect, viewport, padding, radius } = params;
  const safePadding = Math.max(0, padding);
  const paddedLeft = targetRect.left - safePadding;
  const paddedTop = targetRect.top - safePadding;
  const paddedRight = targetRect.right + safePadding;
  const paddedBottom = targetRect.bottom + safePadding;

  const left = clamp(paddedLeft, 0, viewport.width);
  const top = clamp(paddedTop, 0, viewport.height);
  const right = clamp(paddedRight, 0, viewport.width);
  const bottom = clamp(paddedBottom, 0, viewport.height);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  return {
    left,
    top,
    width,
    height,
    right,
    bottom,
    centerX,
    centerY,
    radius: Math.max(0, radius),
  };
}

function isTargetOutsideViewport(
  targetRect: TargetRect,
  viewport: ViewportRect,
  scrollOffset: number,
) {
  const threshold = 8;
  const topSafeArea = Math.max(0, Number(scrollOffset || 0));
  return (
    targetRect.top < topSafeArea + threshold
    || targetRect.bottom > viewport.height - threshold
  );
}

function resolvePopoverStyle(params: {
  spotlightRect: SpotlightRect;
  viewport: ViewportRect;
  placement: TourPlacement;
  offset: number;
}): React.CSSProperties {
  const { spotlightRect, viewport, placement, offset } = params;
  const width = Math.min(
    DEFAULT_POPOVER_WIDTH,
    Math.max(220, viewport.width - DEFAULT_EDGE_GAP * 2),
  );

  const spaceTop = spotlightRect.top;
  const spaceBottom = viewport.height - spotlightRect.bottom;
  const spaceLeft = spotlightRect.left;
  const spaceRight = viewport.width - spotlightRect.right;

  let resolvedPlacement = normalizePlacement(placement);
  if (resolvedPlacement === 'auto') {
    const scores = [
      { placement: 'bottom' as const, space: spaceBottom },
      { placement: 'top' as const, space: spaceTop },
      { placement: 'right' as const, space: spaceRight },
      { placement: 'left' as const, space: spaceLeft },
    ].sort((a, b) => b.space - a.space);
    resolvedPlacement = scores[0]?.placement ?? 'bottom';
  }

  if (
    resolvedPlacement === 'bottom'
    && spaceBottom < DEFAULT_POPOVER_ESTIMATED_HEIGHT
    && spaceTop > spaceBottom
  ) {
    resolvedPlacement = 'top';
  } else if (
    resolvedPlacement === 'top'
    && spaceTop < DEFAULT_POPOVER_ESTIMATED_HEIGHT
    && spaceBottom > spaceTop
  ) {
    resolvedPlacement = 'bottom';
  }

  let left = clamp(
    spotlightRect.centerX - width / 2,
    DEFAULT_EDGE_GAP,
    Math.max(DEFAULT_EDGE_GAP, viewport.width - width - DEFAULT_EDGE_GAP),
  );
  let top = 0;
  let transform: React.CSSProperties['transform'];
  const safeOffset = Math.max(0, offset);

  if (resolvedPlacement === 'top') {
    top = clamp(
      spotlightRect.top - safeOffset,
      DEFAULT_EDGE_GAP,
      viewport.height - DEFAULT_EDGE_GAP,
    );
    transform = 'translateY(-100%)';
  } else if (resolvedPlacement === 'bottom') {
    top = clamp(
      spotlightRect.bottom + safeOffset,
      DEFAULT_EDGE_GAP,
      viewport.height - DEFAULT_EDGE_GAP,
    );
  } else if (resolvedPlacement === 'left') {
    left = clamp(
      spotlightRect.left - safeOffset,
      DEFAULT_EDGE_GAP,
      viewport.width - DEFAULT_EDGE_GAP,
    );
    top = clamp(
      spotlightRect.centerY,
      DEFAULT_EDGE_GAP + DEFAULT_POPOVER_ESTIMATED_HEIGHT / 2,
      viewport.height - DEFAULT_EDGE_GAP - DEFAULT_POPOVER_ESTIMATED_HEIGHT / 2,
    );
    transform = 'translate(-100%, -50%)';
  } else {
    left = clamp(
      spotlightRect.right + safeOffset,
      DEFAULT_EDGE_GAP,
      viewport.width - DEFAULT_EDGE_GAP,
    );
    top = clamp(
      spotlightRect.centerY,
      DEFAULT_EDGE_GAP + DEFAULT_POPOVER_ESTIMATED_HEIGHT / 2,
      viewport.height - DEFAULT_EDGE_GAP - DEFAULT_POPOVER_ESTIMATED_HEIGHT / 2,
    );
    transform = 'translateY(-50%)';
  }

  return {
    left,
    top,
    width,
    transform,
  };
}

function createEmptyLayoutState(): TourLayoutState {
  return {
    maskTopStyle: {},
    maskLeftStyle: {},
    maskRightStyle: {},
    maskBottomStyle: {},
    highlightStyle: {},
    targetBlockerStyle: {},
    popoverStyle: {},
  };
}

function hasLayoutStyle(style: React.CSSProperties) {
  return Object.keys(style).length > 0;
}

export const Tour = React.forwardRef<TourRef, TourReactProps>((props, ref) => {
  const {
    isOpen: isOpenProp,
    defaultOpen = false,
    steps: stepsProp = [],
    currentStep: currentStepProp,
    initialStep = 0,
    autoScroll = true,
    scrollOffset = 96,
    scrollDuration = 220,
    missingTargetStrategy = 'skip',
    canMaskClose = true,
    canBackdropClose = false,
    canShowProgress = true,
    canShowSkip = true,
    canShowPrev = true,
    canShowNext = true,
    skipText = '跳过',
    prevText = '上一步',
    nextText = '下一步',
    finishText = '完成',
    tone,
    className,
    classNames,
    style,
    onOpenChange,
    onStepChange,
    onSkip,
    onFinish,
    onTargetNotFound,
    ...rest
  } = props;

  const steps = React.useMemo(() => normalizeSteps(stepsProp), [stepsProp]);
  const maxStepIndex = Math.max(0, steps.length - 1);

  const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
  const isStepControlled =
    currentStepProp !== null && currentStepProp !== undefined;

  const [innerOpen, setInnerOpen] = React.useState(Boolean(defaultOpen));
  const [innerStep, setInnerStep] = React.useState(() =>
    clamp(Number(initialStep || 0), 0, maxStepIndex),
  );
  const [layout, setLayout] = React.useState<TourLayoutState>(() =>
    createEmptyLayoutState(),
  );
  const [refreshToken, setRefreshToken] = React.useState(0);

  const refreshTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const scrollTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseRef = React.useRef<HTMLDivElement>(null);

  const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;
  const resolvedStepIndex = React.useMemo(() => {
    const candidate = isStepControlled
      ? Number(currentStepProp ?? 0)
      : innerStep;
    return clamp(candidate, 0, maxStepIndex);
  }, [currentStepProp, innerStep, isStepControlled, maxStepIndex]);
  const currentStep = steps[resolvedStepIndex] ?? null;
  const isLastStep = steps.length === 0 || resolvedStepIndex >= steps.length - 1;
  const canInteractWithTarget = currentStep?.canInteractWithTarget !== false;
  const resolvedSkipText = currentStep?.showSkip === false ? null : skipText;
  const resolvedPrevText = currentStep?.prevText ?? prevText;
  const resolvedNextText = isLastStep
    ? (currentStep?.finishText ?? finishText)
    : (currentStep?.nextText ?? nextText);

  const styleObj = typeof style === 'string' ? undefined : style;

  const clearTimers = React.useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  const resetLayout = React.useCallback(() => {
    setLayout(createEmptyLayoutState());
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  React.useEffect(() => {
    if (isStepControlled) {
      return;
    }

    setInnerStep((prev) => clamp(prev, 0, maxStepIndex));
  }, [isStepControlled, maxStepIndex]);

  const emitOpenChange = React.useCallback(
    (nextOpen: boolean, reason: string) => {
      onOpenChange?.(nextOpen, { reason });
    },
    [onOpenChange],
  );

  const emitStepChange = React.useCallback(
    (stepIndex: number, reason: string) => {
      const step = steps[stepIndex] ?? null;
      onStepChange?.(stepIndex, step, {
        reason,
        step,
        stepIndex,
      });
    },
    [onStepChange, steps],
  );

  const setOpen = React.useCallback(
    (nextOpen: boolean, reason: string) => {
      if (!isOpenControlled) {
        setInnerOpen(nextOpen);
      }

      if (!nextOpen) {
        clearTimers();
        resetLayout();
      }

      emitOpenChange(nextOpen, reason);
    },
    [clearTimers, emitOpenChange, isOpenControlled, resetLayout],
  );

  const setStepIndex = React.useCallback(
    (nextStepIndex: number, reason: string) => {
      const normalized = clamp(nextStepIndex, 0, maxStepIndex);

      if (!isStepControlled) {
        setInnerStep(normalized);
      }

      emitStepChange(normalized, reason);
    },
    [emitStepChange, isStepControlled, maxStepIndex],
  );

  const handleStart = React.useCallback(
    (stepIndex?: number) => {
      if (steps.length === 0) {
        return;
      }

      const nextStepIndex = clamp(
        Number(stepIndex ?? initialStep ?? 0),
        0,
        Math.max(0, steps.length - 1),
      );
      setStepIndex(nextStepIndex, 'start');
      setOpen(true, 'start');
    },
    [initialStep, setOpen, setStepIndex, steps.length],
  );

  const handleOpen = React.useCallback(
    (stepIndex?: number) => {
      if (stepIndex === null || stepIndex === undefined) {
        setOpen(true, 'open');
        return;
      }
      handleStart(stepIndex);
    },
    [handleStart, setOpen],
  );

  const handleClose = React.useCallback(() => {
    setOpen(false, 'close');
  }, [setOpen]);

  const handleGoTo = React.useCallback(
    (stepIndex: number) => {
      setStepIndex(stepIndex, 'goto');
    },
    [setStepIndex],
  );

  const handlePrev = React.useCallback(() => {
    if (resolvedStepIndex <= 0) {
      return;
    }

    setStepIndex(resolvedStepIndex - 1, 'prev');
  }, [resolvedStepIndex, setStepIndex]);

  const handleSkip = React.useCallback(() => {
    onSkip?.({
      step: currentStep,
      stepIndex: resolvedStepIndex,
    });
    setOpen(false, 'skip');
  }, [currentStep, onSkip, resolvedStepIndex, setOpen]);

  const handleNext = React.useCallback(() => {
    if (isLastStep) {
      onFinish?.({
        step: currentStep,
        stepIndex: resolvedStepIndex,
      });
      setOpen(false, 'finish');
      return;
    }

    setStepIndex(resolvedStepIndex + 1, 'next');
  }, [currentStep, isLastStep, onFinish, resolvedStepIndex, setOpen, setStepIndex]);

  const handleMaskClick = React.useCallback(() => {
    if (!canMaskClose) {
      return;
    }

    handleSkip();
  }, [canMaskClose, handleSkip]);

  const requestRefresh = React.useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    if (!resolvedOpen) {
      return;
    }

    const handleViewportChange = () => {
      requestRefresh();
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { passive: true });

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange);
    };
  }, [requestRefresh, resolvedOpen]);

  React.useEffect(() => {
    clearTimers();

    if (!resolvedOpen) {
      resetLayout();
      return;
    }

    if (steps.length === 0) {
      setOpen(false, 'empty-steps');
      return;
    }

    let cancelled = false;

    const runMeasure = (retry: number, hasAutoScrolled: boolean, reason: string) => {
      if (cancelled || !resolvedOpen) {
        return;
      }

      const stepIndex = resolvedStepIndex;
      const step = steps[stepIndex];
      if (!step) {
        return;
      }

      const targetElement = document.querySelector(step.selector);
      const targetRect =
        targetElement instanceof Element
          ? resolveTargetRect(targetElement.getBoundingClientRect())
          : null;
      const viewport = resolveViewportRect();

      if (!targetRect) {
        const strategy = missingTargetStrategy ?? 'skip';
        onTargetNotFound?.({
          step,
          stepIndex,
          selector: step.selector,
          strategy,
          reason,
        });

        if (strategy === 'wait' && retry < WAIT_RETRY_MAX) {
          refreshTimerRef.current = window.setTimeout(() => {
            runMeasure(retry + 1, false, `${reason}:wait-retry`);
          }, 120);
          return;
        }

        if (strategy === 'abort') {
          setOpen(false, 'target-missing-abort');
          return;
        }

        if (stepIndex < steps.length - 1) {
          setStepIndex(stepIndex + 1, 'target-missing-skip');
          return;
        }

        setOpen(false, 'target-missing-end');
        return;
      }

      if (
        autoScroll
        && !hasAutoScrolled
        && isTargetOutsideViewport(targetRect, viewport, Number(scrollOffset || 96))
      ) {
        const nextScrollTop = Math.max(
          0,
          viewport.scrollTop + targetRect.top - Number(scrollOffset || 96),
        );
        const duration = Math.max(0, Number(scrollDuration || 220));

        window.scrollTo({
          top: nextScrollTop,
          behavior: duration > 0 ? 'smooth' : 'auto',
        });

        scrollTimerRef.current = window.setTimeout(() => {
          runMeasure(retry + 1, true, `${reason}:autoscroll`);
        }, Math.max(80, duration + 40));
        return;
      }

      const spotlight = resolveSpotlightRect({
        targetRect,
        viewport,
        padding: Number(step.padding ?? DEFAULT_SPOTLIGHT_PADDING),
        radius: Number(step.radius ?? DEFAULT_SPOTLIGHT_RADIUS),
      });

      setLayout({
        maskTopStyle: {
          left: 0,
          top: 0,
          right: 0,
          height: spotlight.top,
        },
        maskLeftStyle: {
          left: 0,
          top: spotlight.top,
          width: spotlight.left,
          height: spotlight.height,
        },
        maskRightStyle: {
          left: spotlight.right,
          top: spotlight.top,
          right: 0,
          height: spotlight.height,
        },
        maskBottomStyle: {
          left: 0,
          top: spotlight.bottom,
          right: 0,
          bottom: 0,
        },
        highlightStyle: {
          left: spotlight.left,
          top: spotlight.top,
          width: spotlight.width,
          height: spotlight.height,
          borderRadius: spotlight.radius,
        },
        targetBlockerStyle: {
          left: spotlight.left,
          top: spotlight.top,
          width: spotlight.width,
          height: spotlight.height,
          borderRadius: spotlight.radius,
        },
        popoverStyle: resolvePopoverStyle({
          spotlightRect: spotlight,
          viewport,
          placement: normalizePlacement(step.placement),
          offset: Number(step.offset ?? DEFAULT_POPOVER_OFFSET),
        }),
      });
    };

    refreshTimerRef.current = window.setTimeout(() => {
      runMeasure(0, false, `measure:${refreshToken}`);
    }, 0);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [
    autoScroll,
    clearTimers,
    missingTargetStrategy,
    onTargetNotFound,
    refreshToken,
    resetLayout,
    resolvedOpen,
    resolvedStepIndex,
    scrollDuration,
    scrollOffset,
    setOpen,
    setStepIndex,
    steps,
  ]);

  React.useImperativeHandle(
    ref,
    () => {
      return Object.assign(baseRef.current || {}, {
        isOpen: resolvedOpen,
        stepIndex: resolvedStepIndex,
        start: handleStart,
        open: handleOpen,
        close: handleClose,
        next: handleNext,
        prev: handlePrev,
        goTo: handleGoTo,
        skip: handleSkip,
      }) as TourRef;
    },
    [
      handleClose,
      handleGoTo,
      handleNext,
      handleOpen,
      handlePrev,
      handleSkip,
      handleStart,
      resolvedOpen,
      resolvedStepIndex,
    ],
  );

  const slots = React.useMemo(
    () =>
      tour({
        tone: tone ?? undefined,
        isInteractive: canInteractWithTarget,
      }),
    [canInteractWithTarget, tone],
  );

  const modalClassNames = React.useMemo<Partial<ModalClassNames>>(
    () => ({
      rootPortal: '',
      backdrop: 'bg-transparent',
      content:
        'fixed inset-0 z-[1001] h-full bg-transparent overflow-visible p-0 shadow-none rounded-none',
      header: 'hidden',
      body: 'hidden',
      footer: 'hidden',
    }),
    [],
  );

  const showProgress = canShowProgress && steps.length > 0;
  const showSkip = canShowSkip && resolvedSkipText !== null;
  const showPrev = canShowPrev && resolvedStepIndex > 0;
  const showNext = canShowNext;

  return (
    <div
      ref={baseRef}
      className={slots.base({ class: [classNames?.base, className] })}
      style={styleObj}
      {...rest}
    >
      <Modal
        className={slots.modal({ class: classNames?.modal })}
        classNames={modalClassNames}
        isOpen={resolvedOpen}
        hasBackdrop={false}
        isDismissable={canBackdropClose}
        motion="none"
        backdrop="transparent"
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setOpen(false, 'modal');
          }
        }}
      >
        <ModalContent className={slots.body({ class: classNames?.body })}>
          {hasLayoutStyle(layout.maskTopStyle) ? (
            <div
              className={slots.mask({ class: classNames?.mask })}
              style={layout.maskTopStyle}
              onClick={handleMaskClick}
            />
          ) : null}
          {hasLayoutStyle(layout.maskLeftStyle) ? (
            <div
              className={slots.mask({ class: classNames?.mask })}
              style={layout.maskLeftStyle}
              onClick={handleMaskClick}
            />
          ) : null}
          {hasLayoutStyle(layout.maskRightStyle) ? (
            <div
              className={slots.mask({ class: classNames?.mask })}
              style={layout.maskRightStyle}
              onClick={handleMaskClick}
            />
          ) : null}
          {hasLayoutStyle(layout.maskBottomStyle) ? (
            <div
              className={slots.mask({ class: classNames?.mask })}
              style={layout.maskBottomStyle}
              onClick={handleMaskClick}
            />
          ) : null}

          {hasLayoutStyle(layout.highlightStyle) ? (
            <div
              className={slots.highlight({ class: classNames?.highlight })}
              style={layout.highlightStyle}
            />
          ) : null}

          {!canInteractWithTarget && hasLayoutStyle(layout.targetBlockerStyle) ? (
            <div
              className={slots.targetBlocker({ class: classNames?.targetBlocker })}
              style={layout.targetBlockerStyle}
            />
          ) : null}

          {hasLayoutStyle(layout.popoverStyle) ? (
            <div
              className={slots.popover({ class: classNames?.popover })}
              style={layout.popoverStyle}
            >
              <div className={slots.header({ class: classNames?.header })}>
                {currentStep?.title ? (
                  <div className={slots.title({ class: classNames?.title })}>
                    {currentStep.title}
                  </div>
                ) : null}
                {currentStep?.description ? (
                  <div
                    className={slots.description({ class: classNames?.description })}
                  >
                    {currentStep.description}
                  </div>
                ) : null}
                {showProgress ? (
                  <div className={slots.progress({ class: classNames?.progress })}>
                    {`${resolvedStepIndex + 1} / ${steps.length}`}
                  </div>
                ) : null}
              </div>

              <div className={slots.footer({ class: classNames?.footer })}>
                <div>
                  {showSkip ? (
                    <Button
                      size="sm"
                      variant="text"
                      className={slots.skipButton({ class: classNames?.skipButton })}
                      onTap={handleSkip}
                    >
                      {resolvedSkipText}
                    </Button>
                  ) : null}
                </div>

                <div className={slots.actions({ class: classNames?.actions })}>
                  {showPrev ? (
                    <Button
                      size="sm"
                      variant="flat"
                      className={slots.prevButton({ class: classNames?.prevButton })}
                      onTap={handlePrev}
                    >
                      {resolvedPrevText}
                    </Button>
                  ) : null}

                  {showNext ? (
                    <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      className={slots.nextButton({ class: classNames?.nextButton })}
                      onTap={handleNext}
                    >
                      {resolvedNextText}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
});

Tour.displayName = 'Srcube.Tour';
