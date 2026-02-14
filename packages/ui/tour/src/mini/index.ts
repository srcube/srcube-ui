import { UIComponent } from '@srcube-ui/runtime/mini';
import { tour } from '../style';
import type {
  TourMiniPlacement,
  TourMiniProps,
  TourMiniStep,
} from './props';
import { tourMiniProps } from './props';

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

type TourMiniState = {
  _innerOpen: boolean;
  _innerStep: number;
  _missingCurrent: boolean;
  _maskTopStyle: string;
  _maskLeftStyle: string;
  _maskRightStyle: string;
  _maskBottomStyle: string;
  _highlightStyle: string;
  _targetBlockerStyle: string;
  _popoverStyle: string;
};

type TourMiniData = TourMiniProps & TourMiniState;

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

function normalizeSteps(rawSteps: unknown): TourMiniStep[] {
  if (!Array.isArray(rawSteps)) {
    return [];
  }

  return rawSteps
    .map((rawStep) => {
      if (!rawStep || typeof rawStep !== 'object') {
        return null;
      }

      const step = rawStep as TourMiniStep;
      if (typeof step.selector !== 'string' || !step.selector.trim()) {
        return null;
      }

      return {
        id: step.id,
        selector: step.selector.trim(),
        title: step.title ? String(step.title) : '',
        description: step.description ? String(step.description) : '',
        placement: step.placement ?? 'auto',
        padding: normalizeNumber(step.padding, DEFAULT_SPOTLIGHT_PADDING),
        radius: normalizeNumber(step.radius, DEFAULT_SPOTLIGHT_RADIUS),
        offset: normalizeNumber(step.offset, DEFAULT_POPOVER_OFFSET),
        canInteractWithTarget: step.canInteractWithTarget !== false,
        showSkip: step.showSkip,
        prevText: step.prevText ? String(step.prevText) : '',
        nextText: step.nextText ? String(step.nextText) : '',
        finishText: step.finishText ? String(step.finishText) : '',
      } satisfies TourMiniStep;
    })
    .filter((step): step is TourMiniStep => Boolean(step));
}

function normalizePlacement(value?: string | null): TourMiniPlacement {
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

function resolveStepIndexFromData(data: TourMiniData) {
  const steps = normalizeSteps(data.steps);
  const max = Math.max(0, steps.length - 1);
  const index =
    data.currentStep === null || data.currentStep === undefined
      ? data._innerStep
      : Number(data.currentStep);
  return clamp(index, 0, max);
}

function resolveCurrentStepFromData(data: TourMiniData) {
  const steps = normalizeSteps(data.steps);
  return steps[resolveStepIndexFromData(data)] ?? null;
}

function resolveViewportRect(
  viewportRect?: WechatMiniprogram.BoundingClientRectCallbackResult | null,
  viewportScroll?: WechatMiniprogram.IAnyObject | null,
): ViewportRect {
  const systemInfo = wx.getWindowInfo?.() ?? wx.getSystemInfoSync();
  const width = Math.max(
    0,
    Number(viewportRect?.width ?? systemInfo.windowWidth ?? 0),
  );
  const height = Math.max(
    0,
    Number(viewportRect?.height ?? systemInfo.windowHeight ?? 0),
  );
  const scrollTop = Math.max(0, Number(viewportScroll?.scrollTop ?? 0));

  return {
    width,
    height,
    scrollTop,
  };
}

function resolveTargetRect(
  rawRect?: WechatMiniprogram.BoundingClientRectCallbackResult | null,
): TargetRect | null {
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
  placement: TourMiniPlacement;
  offset: number;
}): string {
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
  let transform = '';
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

  return `left:${left}px;top:${top}px;width:${width}px;${
    transform ? `transform:${transform};` : ''
  }`;
}

function toStyleString(map: Record<string, string | number | undefined>) {
  const toKebabCase = (key: string) =>
    key.replace(/[A-Z]/g, (matched) => `-${matched.toLowerCase()}`);

  return Object.entries(map)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${toKebabCase(key)}:${value};`)
    .join('');
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    tourMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerStep: 0,
    _missingCurrent: false,
    _maskTopStyle: '',
    _maskLeftStyle: '',
    _maskRightStyle: '',
    _maskBottomStyle: '',
    _highlightStyle: '',
    _targetBlockerStyle: '',
    _popoverStyle: '',
  } satisfies TourMiniState,

  observers: {
    isOpen(nextOpen: TourMiniProps['isOpen']) {
      if (nextOpen === null || nextOpen === undefined) {
        return;
      }

      this._syncOnOpenChange(Boolean(nextOpen), 'prop');
    },
    currentStep(nextStep: TourMiniProps['currentStep']) {
      if (nextStep === null || nextStep === undefined) {
        return;
      }

      this._syncOnStepChange(Number(nextStep), 'prop');
    },
    steps() {
      this._ensureValidStepAndRefresh('steps-change');
    },
  },

  lifetimes: {
    attached() {
      const steps = normalizeSteps(this.data.steps);
      const initialStep = clamp(
        Number(this.data.initialStep || 0),
        0,
        Math.max(0, steps.length - 1),
      );
      const resolvedOpen =
        this.data.isOpen === null || this.data.isOpen === undefined
          ? Boolean(this.data.defaultOpen)
          : Boolean(this.data.isOpen);
      const resolvedStep =
        this.data.currentStep === null || this.data.currentStep === undefined
          ? initialStep
          : clamp(
              Number(this.data.currentStep || 0),
              0,
              Math.max(0, steps.length - 1),
            );

      this.setData(
        {
          _innerOpen: resolvedOpen,
          _innerStep: resolvedStep,
        } satisfies Partial<TourMiniState>,
        () => {
          this._ensureValidStepAndRefresh('attached');
        },
      );
    },
    detached() {
      this._clearTimers();
    },
  },

  computed: {
    $resolvedOpen(data: TourMiniData) {
      return data.isOpen === null || data.isOpen === undefined
        ? data._innerOpen
        : Boolean(data.isOpen);
    },
    $steps(data: TourMiniData) {
      return normalizeSteps(data.steps);
    },
    $stepCount(data: TourMiniData) {
      return normalizeSteps(data.steps).length;
    },
    $stepIndex(data: TourMiniData) {
      return resolveStepIndexFromData(data);
    },
    $currentStep(data: TourMiniData) {
      return resolveCurrentStepFromData(data);
    },
    $isLastStep(data: TourMiniData) {
      const steps = normalizeSteps(data.steps);
      if (steps.length === 0) {
        return true;
      }
      return resolveStepIndexFromData(data) >= steps.length - 1;
    },
    $stepTitle(data: TourMiniData) {
      const step = resolveCurrentStepFromData(data);
      return step?.title ?? '';
    },
    $stepDescription(data: TourMiniData) {
      const step = resolveCurrentStepFromData(data);
      return step?.description ?? '';
    },
    $canInteractWithTarget(data: TourMiniData) {
      const step = resolveCurrentStepFromData(data);
      return step?.canInteractWithTarget !== false;
    },
    $progressText(data: TourMiniData) {
      const count = normalizeSteps(data.steps).length;
      if (count === 0) {
        return '';
      }
      const index = resolveStepIndexFromData(data);
      return `${index + 1} / ${count}`;
    },
    $canShowProgress(data: TourMiniData) {
      return Boolean(data.canShowProgress) && normalizeSteps(data.steps).length > 0;
    },
    $canShowSkip(data: TourMiniData) {
      if (!data.canShowSkip) {
        return false;
      }
      const step = resolveCurrentStepFromData(data);
      return step?.showSkip ?? true;
    },
    $canShowPrev(data: TourMiniData) {
      if (!data.canShowPrev) {
        return false;
      }
      return resolveStepIndexFromData(data) > 0;
    },
    $canShowNext(data: TourMiniData) {
      return Boolean(data.canShowNext);
    },
    $skipText(data: TourMiniData) {
      return data.skipText || '跳过';
    },
    $prevText(data: TourMiniData) {
      const step = resolveCurrentStepFromData(data);
      return step?.prevText || data.prevText || '上一步';
    },
    $nextText(data: TourMiniData) {
      const step = resolveCurrentStepFromData(data);
      const isLastStep =
        resolveStepIndexFromData(data) >= normalizeSteps(data.steps).length - 1;
      if (isLastStep) {
        return step?.finishText || data.finishText || '完成';
      }
      return step?.nextText || data.nextText || '下一步';
    },
    $classNames(data: TourMiniData) {
      const step = resolveCurrentStepFromData(data);
      const slots = tour({
        tone: data.tone ?? undefined,
        isInteractive: step?.canInteractWithTarget !== false,
      });
      const classNames = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: classNames.base }),
        $modal: slots.$modal({ class: classNames.$modal }),
        modal: slots.modal({ class: classNames.modal }),
        body: slots.body({ class: classNames.body }),
        mask: slots.mask({ class: classNames.mask }),
        highlight: slots.highlight({ class: classNames.highlight }),
        targetBlocker: slots.targetBlocker({ class: classNames.targetBlocker }),
        popover: slots.popover({ class: classNames.popover }),
        header: slots.header({ class: classNames.header }),
        title: slots.title({ class: classNames.title }),
        description: slots.description({ class: classNames.description }),
        progress: slots.progress({ class: classNames.progress }),
        footer: slots.footer({ class: classNames.footer }),
        actions: slots.actions({ class: classNames.actions }),
        skipButton: slots.skipButton({ class: classNames.skipButton }),
        prevButton: slots.prevButton({ class: classNames.prevButton }),
        nextButton: slots.nextButton({ class: classNames.nextButton }),
      };
    },
    $modalClassNames() {
      return {
        rootPortal: '',
        backdrop: 'bg-transparent',
        content:
          'fixed inset-0 z-[1001] h-full bg-transparent overflow-visible p-0 shadow-none rounded-none',
        header: 'hidden',
        body: 'p-0',
        footer: 'hidden',
      };
    },
  },

  methods: {
    _clearOverlayStyles() {
      this.setData({
        _missingCurrent: false,
        _maskTopStyle: '',
        _maskLeftStyle: '',
        _maskRightStyle: '',
        _maskBottomStyle: '',
        _highlightStyle: '',
        _targetBlockerStyle: '',
        _popoverStyle: '',
      } satisfies Partial<TourMiniState>);
    },

    _syncOnOpenChange(nextOpen: boolean, reason: string) {
      this._clearTimers();
      if (!nextOpen) {
        this._clearOverlayStyles();
        return;
      }

      this._queueRefresh(0, `open:${reason}`);
    },

    _syncOnStepChange(_nextStepIndex: number, reason: string) {
      if (!this._getResolvedOpen()) {
        return;
      }

      this._queueRefresh(0, `step:${reason}`);
    },

    _clearTimers() {
      const instance = this as typeof this & {
        _refreshTimer?: ReturnType<typeof setTimeout>;
        _scrollTimer?: ReturnType<typeof setTimeout>;
      };

      if (instance._refreshTimer) {
        clearTimeout(instance._refreshTimer);
        instance._refreshTimer = undefined;
      }
      if (instance._scrollTimer) {
        clearTimeout(instance._scrollTimer);
        instance._scrollTimer = undefined;
      }
    },

    _isOpenControlled() {
      return this.data.isOpen !== null && this.data.isOpen !== undefined;
    },

    _isStepControlled() {
      return this.data.currentStep !== null && this.data.currentStep !== undefined;
    },

    _getSteps() {
      return normalizeSteps(this.data.steps);
    },

    _getResolvedOpen() {
      return this._isOpenControlled() ? Boolean(this.data.isOpen) : this.data._innerOpen;
    },

    _getResolvedStepIndex() {
      const steps = this._getSteps();
      const max = Math.max(0, steps.length - 1);
      const index = this._isStepControlled()
        ? Number(this.data.currentStep ?? 0)
        : this.data._innerStep;
      return clamp(index, 0, max);
    },

    _emitOpenChange(isOpen: boolean, reason: string) {
      this.triggerEvent('openchange', { isOpen, reason });
    },

    _emitStepChange(stepIndex: number, reason: string) {
      const steps = this._getSteps();
      const step = steps[stepIndex] ?? null;
      this.triggerEvent('stepchange', { stepIndex, step, reason });
    },

    _setOpen(nextOpen: boolean, reason: string) {
      const apply = () => {
        this._syncOnOpenChange(nextOpen, reason);
        this._emitOpenChange(nextOpen, reason);
      };

      if (this._isOpenControlled()) {
        apply();
        return;
      }

      this.setData(
        {
          _innerOpen: nextOpen,
        } satisfies Partial<TourMiniState>,
        apply,
      );
    },

    _setStepIndex(nextStepIndex: number, reason: string) {
      const steps = this._getSteps();
      const max = Math.max(0, steps.length - 1);
      const normalized = clamp(nextStepIndex, 0, max);

      const apply = () => {
        this._emitStepChange(normalized, reason);
        if (this._getResolvedOpen()) {
          this._queueRefresh(0, `step:${reason}`);
        }
      };

      if (this._isStepControlled()) {
        apply();
        return;
      }

      this.setData(
        {
          _innerStep: normalized,
        } satisfies Partial<TourMiniState>,
        apply,
      );
    },

    _ensureValidStepAndRefresh(reason: string) {
      const steps = this._getSteps();
      if (!this._getResolvedOpen()) {
        return;
      }

      if (steps.length === 0) {
        this._setOpen(false, 'empty-steps');
        return;
      }

      const index = this._getResolvedStepIndex();
      if (!this._isStepControlled() && index !== this.data._innerStep) {
        this.setData(
          {
            _innerStep: index,
          } satisfies Partial<TourMiniState>,
          () => {
            this._queueRefresh(0, reason);
          },
        );
        return;
      }

      this._queueRefresh(0, reason);
    },

    _queueRefresh(delay = 0, reason = 'refresh') {
      this._clearTimers();
      if (!this._getResolvedOpen()) {
        return;
      }

      const instance = this as typeof this & {
        _refreshTimer?: ReturnType<typeof setTimeout>;
      };

      instance._refreshTimer = setTimeout(() => {
        instance._refreshTimer = undefined;
        this._measureAndLayout(0, false, reason);
      }, Math.max(0, delay));
    },

    _measureAndLayout(retry: number, hasAutoScrolled: boolean, reason: string) {
      if (!this._getResolvedOpen()) {
        return;
      }

      const steps = this._getSteps();
      if (steps.length === 0) {
        return;
      }

      const stepIndex = this._getResolvedStepIndex();
      const step = steps[stepIndex];
      if (!step) {
        return;
      }

      const query = wx.createSelectorQuery();
      query.select(step.selector).boundingClientRect();
      query.selectViewport().boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((results) => {
        const targetRect = resolveTargetRect(
          results?.[0] as WechatMiniprogram.BoundingClientRectCallbackResult | null,
        );
        const viewport = resolveViewportRect(
          results?.[1] as WechatMiniprogram.BoundingClientRectCallbackResult | null,
          results?.[2] as WechatMiniprogram.IAnyObject | null,
        );

        if (!targetRect) {
          this._handleMissingTarget(stepIndex, step, retry, reason);
          return;
        }

        if (
          this.data.autoScroll
          && !hasAutoScrolled
          && isTargetOutsideViewport(
            targetRect,
            viewport,
            Number(this.data.scrollOffset || 96),
          )
        ) {
          const nextScrollTop = Math.max(
            0,
            viewport.scrollTop + targetRect.top - Number(this.data.scrollOffset || 96),
          );
          const duration = Math.max(0, Number(this.data.scrollDuration || 220));

          wx.pageScrollTo({
            scrollTop: nextScrollTop,
            duration,
          });

          const instance = this as typeof this & {
            _scrollTimer?: ReturnType<typeof setTimeout>;
          };
          instance._scrollTimer = setTimeout(() => {
            instance._scrollTimer = undefined;
            this._measureAndLayout(retry + 1, true, `${reason}:autoscroll`);
          }, Math.max(80, duration + 40));
          return;
        }

        const spotlight = resolveSpotlightRect({
          targetRect,
          viewport,
          padding: Number(step.padding ?? DEFAULT_SPOTLIGHT_PADDING),
          radius: Number(step.radius ?? DEFAULT_SPOTLIGHT_RADIUS),
        });

        const highlightStyle = toStyleString({
          left: `${spotlight.left}px`,
          top: `${spotlight.top}px`,
          width: `${spotlight.width}px`,
          height: `${spotlight.height}px`,
          borderRadius: `${spotlight.radius}px`,
        });

        const blockerStyle = toStyleString({
          left: `${spotlight.left}px`,
          top: `${spotlight.top}px`,
          width: `${spotlight.width}px`,
          height: `${spotlight.height}px`,
          borderRadius: `${spotlight.radius}px`,
        });

        const maskTopStyle = toStyleString({
          left: 0,
          top: 0,
          right: 0,
          height: `${spotlight.top}px`,
        });
        const maskLeftStyle = toStyleString({
          left: 0,
          top: `${spotlight.top}px`,
          width: `${spotlight.left}px`,
          height: `${spotlight.height}px`,
        });
        const maskRightStyle = toStyleString({
          left: `${spotlight.right}px`,
          top: `${spotlight.top}px`,
          right: 0,
          height: `${spotlight.height}px`,
        });
        const maskBottomStyle = toStyleString({
          left: 0,
          top: `${spotlight.bottom}px`,
          right: 0,
          bottom: 0,
        });

        const popoverStyle = resolvePopoverStyle({
          spotlightRect: spotlight,
          viewport,
          placement: normalizePlacement(step.placement),
          offset: Number(step.offset ?? DEFAULT_POPOVER_OFFSET),
        });

        this.setData({
          _missingCurrent: false,
          _maskTopStyle: maskTopStyle,
          _maskLeftStyle: maskLeftStyle,
          _maskRightStyle: maskRightStyle,
          _maskBottomStyle: maskBottomStyle,
          _highlightStyle: highlightStyle,
          _targetBlockerStyle: blockerStyle,
          _popoverStyle: popoverStyle,
        } satisfies Partial<TourMiniState>);
      });
    },

    _handleMissingTarget(
      stepIndex: number,
      step: TourMiniStep,
      retry: number,
      reason: string,
    ) {
      const strategy = this.data.missingTargetStrategy || 'skip';
      this.triggerEvent('targetnotfound', {
        stepIndex,
        step,
        selector: step.selector,
        strategy,
        reason,
      });

      if (strategy === 'wait' && retry < WAIT_RETRY_MAX) {
        const instance = this as typeof this & {
          _refreshTimer?: ReturnType<typeof setTimeout>;
        };

        this._clearTimers();
        instance._refreshTimer = setTimeout(() => {
          instance._refreshTimer = undefined;
          this._measureAndLayout(retry + 1, false, `${reason}:wait-retry`);
        }, 120);
        return;
      }

      if (strategy === 'abort') {
        this._setOpen(false, 'target-missing-abort');
        return;
      }

      const steps = this._getSteps();
      if (stepIndex < steps.length - 1) {
        this._setStepIndex(stepIndex + 1, 'target-missing-skip');
        return;
      }

      this._setOpen(false, 'target-missing-end');
    },

    start(stepIndex?: number) {
      const steps = this._getSteps();
      if (steps.length === 0) {
        return;
      }
      const nextStepIndex = clamp(
        Number(stepIndex ?? this.data.initialStep ?? 0),
        0,
        Math.max(0, steps.length - 1),
      );
      this._setStepIndex(nextStepIndex, 'start');
      this._setOpen(true, 'start');
    },

    next() {
      this.handleNextTap();
    },

    prev() {
      this.handlePrevTap();
    },

    goTo(stepIndex: number) {
      this._setStepIndex(stepIndex, 'goto');
    },

    close() {
      this._setOpen(false, 'close');
    },

    skip() {
      this.handleSkipTap();
    },

    handleTouchMoveCapture() {
      // Intentionally empty:
      // `catchtouchmove` is used to lock page scroll while tour is open.
    },

    handleMaskTap() {
      if (!this.data.canMaskClose) {
        return;
      }
      this.handleSkipTap();
    },

    handleModalOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const nextOpen = Boolean(e.detail?.isOpen);
      if (!nextOpen) {
        this._setOpen(false, 'modal');
      }
    },

    handleSkipTap() {
      const stepIndex = this._getResolvedStepIndex();
      const steps = this._getSteps();
      const step = steps[stepIndex] ?? null;
      this.triggerEvent('skip', { stepIndex, step });
      this._setOpen(false, 'skip');
    },

    handlePrevTap() {
      const stepIndex = this._getResolvedStepIndex();
      if (stepIndex <= 0) {
        return;
      }
      this._setStepIndex(stepIndex - 1, 'prev');
    },

    handleNextTap() {
      const stepIndex = this._getResolvedStepIndex();
      const steps = this._getSteps();
      const isLastStep = stepIndex >= steps.length - 1;

      if (isLastStep) {
        const step = steps[stepIndex] ?? null;
        this.triggerEvent('finish', { stepIndex, step });
        this._setOpen(false, 'finish');
        return;
      }

      this._setStepIndex(stepIndex + 1, 'next');
    },
  },
});

export { tour } from '../style';
export type {
  TourMiniPlacement,
  TourMiniProps,
  TourMiniStep,
  TourMiniStepId,
} from './props';
export { tourMiniProps } from './props';
