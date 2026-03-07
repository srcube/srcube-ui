import {
  type SwipeActionVariants,
  swipeAction,
} from '@srcube-ui/styles/components/swipe-action/style';
import { UIComponent } from '../../shared/ui-component';
import type {
  SwipeActionMiniDirection,
  SwipeActionMiniItem,
  SwipeActionMiniProps,
} from './props';
import { swipeActionMiniProps } from './props';

type SwipeActionMiniSize = NonNullable<SwipeActionVariants['size']>;
type SwipeActionMiniColor = NonNullable<SwipeActionVariants['color']>;

type SwipeActionMiniState = {
  _innerOpenDirection: SwipeActionMiniDirection;
  _offset: number;
  _startX: number;
  _startY: number;
  _startOffset: number;
  _isDragging: boolean;
  _hasHorizontalIntent: boolean;
};

type SwipeActionMiniData = SwipeActionMiniProps & SwipeActionMiniState;

type SwipeActionMiniComputedItem = SwipeActionMiniItem & {
  buttonColor: SwipeActionMiniColor;
  widthStyle: string;
};

function isControlledDirection(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveDirection(value: unknown): SwipeActionMiniDirection {
  if (value === 'left' || value === 'right') {
    return value;
  }

  return 'none';
}

function resolveDefaultActionWidth(size: SwipeActionMiniSize) {
  if (size === 'sm') {
    return 56;
  }

  if (size === 'lg') {
    return 72;
  }

  return 64;
}

function resolveActionWidth(value: unknown, size: SwipeActionMiniSize): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return resolveDefaultActionWidth(size);
  }

  return Math.floor(parsed);
}

function resolveThreshold(value: unknown, actionWidth: number): number {
  const parsed = Number(value);

  if (Number.isFinite(parsed) && parsed >= 0) {
    return parsed;
  }

  return actionWidth / 2;
}

function resolveSize(value: unknown): SwipeActionMiniSize {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveColor(value: unknown): SwipeActionMiniColor {
  if (
    value === 'primary' ||
    value === 'secondary' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'danger'
  ) {
    return value;
  }

  return 'default';
}

function resolveActionColor(
  value: unknown,
  fallback: SwipeActionMiniColor,
): SwipeActionMiniColor {
  if (
    value === 'primary' ||
    value === 'secondary' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'danger'
  ) {
    return value;
  }

  if (value === 'default') {
    return value;
  }

  return fallback;
}

function normalizeActions(raw: unknown): SwipeActionMiniItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as {
        key?: unknown;
        id?: unknown;
        label?: unknown;
        text?: unknown;
        color?: unknown;
        iconClassName?: unknown;
        icon?: unknown;
        isDisabled?: unknown;
        className?: unknown;
      };

      const key = candidate.key ?? candidate.id ?? index;
      if (typeof key !== 'string' && typeof key !== 'number') {
        return null;
      }

      return {
        key,
        label: String(candidate.label ?? candidate.text ?? key),
        color: resolveActionColor(candidate.color, 'default'),
        iconClassName:
          typeof candidate.iconClassName === 'string'
            ? candidate.iconClassName
            : typeof candidate.icon === 'string'
              ? candidate.icon
              : '',
        isDisabled: candidate.isDisabled === true,
        className:
          typeof candidate.className === 'string' ? candidate.className : '',
      } satisfies SwipeActionMiniItem;
    })
    .filter((item): item is SwipeActionMiniItem => Boolean(item));
}

function resolveWidths(
  data: Pick<
    SwipeActionMiniData,
    'leftActions' | 'rightActions' | 'actionWidth' | 'size'
  >,
) {
  const actionWidth = resolveActionWidth(
    data.actionWidth,
    resolveSize(data.size),
  );
  const leftCount = normalizeActions(data.leftActions).length;
  const rightCount = normalizeActions(data.rightActions).length;

  return {
    actionWidth,
    leftWidth: leftCount * actionWidth,
    rightWidth: rightCount * actionWidth,
  };
}

function clampOffset(offset: number, leftWidth: number, rightWidth: number) {
  if (offset > leftWidth) {
    return leftWidth;
  }

  if (offset < -rightWidth) {
    return -rightWidth;
  }

  return offset;
}

function sanitizeDirection(
  direction: SwipeActionMiniDirection,
  leftWidth: number,
  rightWidth: number,
): SwipeActionMiniDirection {
  if (direction === 'left' && leftWidth <= 0) {
    return 'none';
  }

  if (direction === 'right' && rightWidth <= 0) {
    return 'none';
  }

  return direction;
}

function resolveOffsetByDirection(
  direction: SwipeActionMiniDirection,
  leftWidth: number,
  rightWidth: number,
) {
  if (direction === 'left') {
    return leftWidth;
  }

  if (direction === 'right') {
    return -rightWidth;
  }

  return 0;
}

function resolveDirectionByOffset(params: {
  offset: number;
  threshold: number;
  leftWidth: number;
  rightWidth: number;
}) {
  const { offset, threshold, leftWidth, rightWidth } = params;

  if (offset > 0 && leftWidth > 0 && offset >= threshold) {
    return 'left' as const;
  }

  if (offset < 0 && rightWidth > 0 && Math.abs(offset) >= threshold) {
    return 'right' as const;
  }

  return 'none' as const;
}

function buildComputedActions(params: {
  actions: unknown;
  actionWidth: unknown;
  size: unknown;
  color: unknown;
}): SwipeActionMiniComputedItem[] {
  const componentColor = resolveColor(params.color);
  const actionWidth = resolveActionWidth(
    params.actionWidth,
    resolveSize(params.size),
  );

  return normalizeActions(params.actions).map((item) => ({
    ...item,
    buttonColor: resolveActionColor(item.color, componentColor),
    widthStyle: `width: ${actionWidth}px;`,
  }));
}

function resolveCurrentDirection(
  data: SwipeActionMiniData,
): SwipeActionMiniDirection {
  const rawDirection = isControlledDirection(data.openDirection)
    ? resolveDirection(data.openDirection)
    : resolveDirection(data._innerOpenDirection);

  const { leftWidth, rightWidth } = resolveWidths(data);
  return sanitizeDirection(rawDirection, leftWidth, rightWidth);
}

function resolveTouchPoint(
  event: WechatMiniprogram.TouchEvent,
): WechatMiniprogram.Touch | undefined {
  return event.touches?.[0] ?? event.changedTouches?.[0];
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    swipeActionMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpenDirection: 'none' as SwipeActionMiniDirection,
    _offset: 0,
    _startX: 0,
    _startY: 0,
    _startOffset: 0,
    _isDragging: false,
    _hasHorizontalIntent: false,
  } satisfies SwipeActionMiniState,

  observers: {
    openDirection() {
      this.syncOffsetFromDirection();
    },
    leftActions() {
      this.syncOffsetFromDirection();
    },
    rightActions() {
      this.syncOffsetFromDirection();
    },
    actionWidth() {
      this.syncOffsetFromDirection();
    },
    size() {
      this.syncOffsetFromDirection();
    },
    isDisabled(nextValue) {
      if (nextValue) {
        this.setDirection('none', true);
      }
    },
  },

  lifetimes: {
    attached() {
      const { leftWidth, rightWidth } = resolveWidths(this.data);
      const initialDirection = sanitizeDirection(
        isControlledDirection(this.data.openDirection)
          ? resolveDirection(this.data.openDirection)
          : resolveDirection(this.data.defaultOpenDirection),
        leftWidth,
        rightWidth,
      );

      this.setData({
        _innerOpenDirection: initialDirection,
        _offset: resolveOffsetByDirection(
          initialDirection,
          leftWidth,
          rightWidth,
        ),
      } satisfies Partial<SwipeActionMiniState>);
    },
  },

  computed: {
    $resolvedDirection(data: SwipeActionMiniData) {
      return resolveCurrentDirection(data);
    },

    $resolvedSize(data: SwipeActionMiniData) {
      return resolveSize(data.size);
    },

    $leftActions(data: SwipeActionMiniData) {
      return buildComputedActions({
        actions: data.leftActions,
        actionWidth: data.actionWidth,
        size: data.size,
        color: data.color,
      });
    },

    $rightActions(data: SwipeActionMiniData) {
      return buildComputedActions({
        actions: data.rightActions,
        actionWidth: data.actionWidth,
        size: data.size,
        color: data.color,
      });
    },

    $leftGroupStyle(data: SwipeActionMiniData) {
      const { leftWidth } = resolveWidths(data);
      return `width: ${leftWidth}px;`;
    },

    $rightGroupStyle(data: SwipeActionMiniData) {
      const { rightWidth } = resolveWidths(data);
      return `width: ${rightWidth}px;`;
    },

    $contentStyle(data: SwipeActionMiniData) {
      const { leftWidth, rightWidth } = resolveWidths(data);
      const nextOffset = clampOffset(
        Number(data._offset ?? 0),
        leftWidth,
        rightWidth,
      );
      const transitionDuration = data._isDragging ? 0 : 220;

      return `transform: translate3d(${nextOffset}px, 0, 0); transition-duration: ${transitionDuration}ms;`;
    },

    $classNames(data: SwipeActionMiniData) {
      const slots = swipeAction({
        color: data.color ?? undefined,
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
      });

      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        actions: slots.actions({ class: custom.actions }),
        leftActions: slots.leftActions({ class: custom.leftActions }),
        rightActions: slots.rightActions({ class: custom.rightActions }),
        action: slots.action({ class: custom.action }),
        actionButton: slots.actionButton({ class: custom.actionButton }),
        actionIcon: slots.actionIcon({ class: custom.actionIcon }),
        actionLabel: slots.actionLabel({ class: custom.actionLabel }),
        content: slots.content({ class: custom.content }),
      };
    },
  },

  methods: {
    syncOffsetFromDirection() {
      if (this.data._isDragging) {
        return;
      }

      const { leftWidth, rightWidth } = resolveWidths(this.data);
      const nextDirection = resolveCurrentDirection(this.data);
      const nextOffset = resolveOffsetByDirection(
        nextDirection,
        leftWidth,
        rightWidth,
      );

      const patch: Partial<SwipeActionMiniState> = {};

      if (!isControlledDirection(this.data.openDirection)) {
        patch._innerOpenDirection = nextDirection;
      }

      if (nextOffset !== this.data._offset) {
        patch._offset = nextOffset;
      }

      if (Object.keys(patch).length > 0) {
        this.setData(patch);
      }
    },

    setDirection(direction: SwipeActionMiniDirection, emitOpenChange: boolean) {
      const { leftWidth, rightWidth } = resolveWidths(this.data);
      const currentDirection = resolveCurrentDirection(this.data);
      const nextDirection = sanitizeDirection(direction, leftWidth, rightWidth);
      const nextOffset = resolveOffsetByDirection(
        nextDirection,
        leftWidth,
        rightWidth,
      );

      const patch: Partial<SwipeActionMiniState> = {
        _offset: nextOffset,
      };

      if (!isControlledDirection(this.data.openDirection)) {
        patch._innerOpenDirection = nextDirection;
      }

      this.setData(patch, () => {
        if (emitOpenChange && currentDirection !== nextDirection) {
          this.triggerEvent('openchange', {
            openDirection: nextDirection,
          });
        }
      });
    },

    handleTouchStart(event: WechatMiniprogram.TouchEvent) {
      if (this.data.isDisabled) {
        return;
      }

      const point = resolveTouchPoint(event);
      if (!point) {
        return;
      }

      this.setData({
        _startX: point.clientX,
        _startY: point.clientY,
        _startOffset: this.data._offset,
        _isDragging: true,
        _hasHorizontalIntent: false,
      } satisfies Partial<SwipeActionMiniState>);
    },

    handleTouchMove(event: WechatMiniprogram.TouchEvent) {
      if (this.data.isDisabled || !this.data._isDragging) {
        return;
      }

      const point = resolveTouchPoint(event);
      if (!point) {
        return;
      }

      const deltaX = point.clientX - this.data._startX;
      const deltaY = point.clientY - this.data._startY;

      if (!this.data._hasHorizontalIntent) {
        if (Math.abs(deltaX) < 3) {
          return;
        }

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }

        this.setData({
          _hasHorizontalIntent: true,
        } satisfies Partial<SwipeActionMiniState>);
      }

      if (!this.data._hasHorizontalIntent) {
        return;
      }

      const { leftWidth, rightWidth } = resolveWidths(this.data);
      const nextOffset = clampOffset(
        this.data._startOffset + deltaX,
        leftWidth,
        rightWidth,
      );

      if (nextOffset !== this.data._offset) {
        this.setData({
          _offset: nextOffset,
        } satisfies Partial<SwipeActionMiniState>);
      }
    },

    handleTouchEnd() {
      if (!this.data._isDragging) {
        return;
      }

      const hasHorizontalIntent = this.data._hasHorizontalIntent;
      const currentOffset = this.data._offset;
      const finish = () => {
        if (!hasHorizontalIntent) {
          return;
        }

        const { actionWidth, leftWidth, rightWidth } = resolveWidths(this.data);
        const threshold = resolveThreshold(this.data.threshold, actionWidth);

        const nextDirection = resolveDirectionByOffset({
          offset: currentOffset,
          threshold,
          leftWidth,
          rightWidth,
        });

        this.setDirection(nextDirection, true);
      };

      this.setData(
        {
          _isDragging: false,
          _hasHorizontalIntent: false,
        } satisfies Partial<SwipeActionMiniState>,
        finish,
      );
    },

    handleTouchCancel() {
      this.handleTouchEnd();
    },

    handleContentTap(event: WechatMiniprogram.TouchEvent) {
      if (this.data.isDisabled) {
        return;
      }

      const currentDirection = resolveCurrentDirection(this.data);
      if (currentDirection !== 'none') {
        this.setDirection('none', true);
        return;
      }

      this.triggerEvent('tap', event.detail ?? {});
    },

    handleActionTap(event: WechatMiniprogram.TouchEvent) {
      if (this.data.isDisabled) {
        return;
      }

      const dataset = event.currentTarget.dataset as {
        direction?: SwipeActionMiniDirection;
        index?: string | number;
      };

      const direction =
        dataset.direction === 'left' || dataset.direction === 'right'
          ? dataset.direction
          : null;

      if (!direction) {
        return;
      }

      const index = Number(dataset.index);
      if (!Number.isInteger(index) || index < 0) {
        return;
      }

      const actions = normalizeActions(
        direction === 'left' ? this.data.leftActions : this.data.rightActions,
      );
      const item = actions[index];

      if (!item || item.isDisabled) {
        return;
      }

      this.triggerEvent('action', {
        key: item.key,
        index,
        direction,
        item,
      });

      this.setDirection('none', true);
    },
  },
});

export { swipeAction } from '@srcube-ui/styles/components/swipe-action/style';
export type {
  SwipeActionMiniDirection,
  SwipeActionMiniItem,
  SwipeActionMiniProps,
} from './props';
export { swipeActionMiniProps } from './props';
