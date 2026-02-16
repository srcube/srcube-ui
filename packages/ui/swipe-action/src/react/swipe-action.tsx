import { Button } from '@srcube-ui/button';
import * as React from 'react';
import { swipeAction } from '../style';
import type {
  SwipeActionDirection,
  SwipeActionItem,
  SwipeActionReactProps,
} from './props';

function isControlled(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveDirection(value: unknown): SwipeActionDirection {
  if (value === 'left' || value === 'right') {
    return value;
  }

  return 'none';
}

function resolveActionWidth(value: unknown): number {
  const parsed = Number(value ?? 64);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 64;
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

function normalizeActions(
  rawActions: SwipeActionItem[] | undefined,
): SwipeActionItem[] {
  if (!Array.isArray(rawActions)) {
    return [];
  }

  return rawActions
    .map((item) => {
      if (
        !item ||
        (typeof item.key !== 'string' && typeof item.key !== 'number')
      ) {
        return null;
      }

      return {
        ...item,
        label: item.label ?? String(item.key),
      } satisfies SwipeActionItem;
    })
    .filter((item): item is SwipeActionItem => Boolean(item));
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
  direction: SwipeActionDirection,
  leftWidth: number,
  rightWidth: number,
): SwipeActionDirection {
  if (direction === 'left' && leftWidth <= 0) {
    return 'none';
  }

  if (direction === 'right' && rightWidth <= 0) {
    return 'none';
  }

  return direction;
}

function resolveOffsetByDirection(
  direction: SwipeActionDirection,
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

type SwipeSide = Exclude<SwipeActionDirection, 'none'>;

export const SwipeAction = React.forwardRef<
  HTMLDivElement,
  SwipeActionReactProps
>((props, ref) => {
  const {
    leftActions: leftActionsProp,
    rightActions: rightActionsProp,
    actionWidth: actionWidthProp,
    threshold,
    openDirection: openDirectionProp,
    defaultOpenDirection = 'none',
    color,
    size,
    isDisabled = false,
    className,
    classNames,
    style,
    children,
    onTap,
    onAction,
    onOpenDirectionChange,
    ...rest
  } = props;

  const leftActions = React.useMemo(
    () => normalizeActions(leftActionsProp),
    [leftActionsProp],
  );
  const rightActions = React.useMemo(
    () => normalizeActions(rightActionsProp),
    [rightActionsProp],
  );

  const actionWidth = React.useMemo(
    () => resolveActionWidth(actionWidthProp),
    [actionWidthProp],
  );

  const leftWidth = leftActions.length * actionWidth;
  const rightWidth = rightActions.length * actionWidth;
  const resolvedThreshold = resolveThreshold(threshold, actionWidth);

  const isDirectionControlled = isControlled(openDirectionProp);

  const [innerOpenDirection, setInnerOpenDirection] =
    React.useState<SwipeActionDirection>(() =>
      sanitizeDirection(
        resolveDirection(defaultOpenDirection),
        leftWidth,
        rightWidth,
      ),
    );

  const resolvedOpenDirection = isDirectionControlled
    ? resolveDirection(openDirectionProp)
    : innerOpenDirection;

  const effectiveOpenDirection = sanitizeDirection(
    resolvedOpenDirection,
    leftWidth,
    rightWidth,
  );

  const [offset, setOffset] = React.useState(() =>
    resolveOffsetByDirection(effectiveOpenDirection, leftWidth, rightWidth),
  );
  const [isDragging, setIsDragging] = React.useState(false);

  const offsetRef = React.useRef(offset);
  React.useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  React.useEffect(() => {
    if (isDragging) {
      return;
    }

    const nextOffset = resolveOffsetByDirection(
      effectiveOpenDirection,
      leftWidth,
      rightWidth,
    );

    if (nextOffset !== offsetRef.current) {
      setOffset(nextOffset);
    }
  }, [effectiveOpenDirection, isDragging, leftWidth, rightWidth]);

  React.useEffect(() => {
    if (isDirectionControlled) {
      return;
    }

    if (innerOpenDirection !== effectiveOpenDirection) {
      setInnerOpenDirection(effectiveOpenDirection);
    }
  }, [effectiveOpenDirection, innerOpenDirection, isDirectionControlled]);

  const setDirection = React.useCallback(
    (nextDirection: SwipeActionDirection) => {
      const sanitized = sanitizeDirection(nextDirection, leftWidth, rightWidth);

      if (!isDirectionControlled) {
        setInnerOpenDirection(sanitized);
      }

      setOffset(resolveOffsetByDirection(sanitized, leftWidth, rightWidth));

      if (sanitized !== effectiveOpenDirection) {
        onOpenDirectionChange?.(sanitized);
      }
    },
    [
      effectiveOpenDirection,
      isDirectionControlled,
      leftWidth,
      onOpenDirectionChange,
      rightWidth,
    ],
  );

  const pointerIdRef = React.useRef<number | null>(null);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const startOffsetRef = React.useRef(0);
  const hasHorizontalIntentRef = React.useRef(false);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDisabled) {
        return;
      }

      pointerIdRef.current = event.pointerId;
      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
      startOffsetRef.current = offsetRef.current;
      hasHorizontalIntentRef.current = false;

      if (typeof event.currentTarget.setPointerCapture === 'function') {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    [isDisabled],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDisabled || pointerIdRef.current !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - startXRef.current;
      const deltaY = event.clientY - startYRef.current;

      if (!hasHorizontalIntentRef.current) {
        if (Math.abs(deltaX) < 3) {
          return;
        }

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }

        hasHorizontalIntentRef.current = true;
        setIsDragging(true);
      }

      const nextOffset = clampOffset(
        startOffsetRef.current + deltaX,
        leftWidth,
        rightWidth,
      );

      if (nextOffset === offsetRef.current) {
        return;
      }

      setOffset(nextOffset);

      if (event.cancelable) {
        event.preventDefault();
      }
    },
    [isDisabled, leftWidth, rightWidth],
  );

  const finishPointerInteraction = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>, shouldHandleTap: boolean) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      pointerIdRef.current = null;

      if (typeof event.currentTarget.releasePointerCapture === 'function') {
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore: pointer may already be released.
        }
      }

      const hasIntent = hasHorizontalIntentRef.current;
      hasHorizontalIntentRef.current = false;
      setIsDragging(false);

      if (!hasIntent) {
        if (!shouldHandleTap) {
          return;
        }

        if (effectiveOpenDirection !== 'none') {
          setDirection('none');
          return;
        }

        onTap?.(event as unknown as React.MouseEvent<HTMLDivElement>);
        return;
      }

      const nextDirection = resolveDirectionByOffset({
        offset: offsetRef.current,
        threshold: resolvedThreshold,
        leftWidth,
        rightWidth,
      });

      setDirection(nextDirection);
    },
    [
      effectiveOpenDirection,
      leftWidth,
      onTap,
      resolvedThreshold,
      rightWidth,
      setDirection,
    ],
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      finishPointerInteraction(event, true);
    },
    [finishPointerInteraction],
  );

  const handlePointerCancel = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      finishPointerInteraction(event, false);
    },
    [finishPointerInteraction],
  );

  const slots = React.useMemo(
    () =>
      swipeAction({
        color,
        size,
        isDisabled,
      }),
    [color, isDisabled, size],
  );

  const classes = React.useMemo(
    () => ({
      base: slots.base({ class: [classNames?.base, className] }),
      actions: slots.actions({ class: classNames?.actions }),
      leftActions: slots.leftActions({ class: classNames?.leftActions }),
      rightActions: slots.rightActions({ class: classNames?.rightActions }),
      action: slots.action({ class: classNames?.action }),
      actionButton: slots.actionButton({ class: classNames?.actionButton }),
      actionLabel: slots.actionLabel({ class: classNames?.actionLabel }),
      content: slots.content({ class: classNames?.content }),
    }),
    [
      className,
      classNames?.action,
      classNames?.actionButton,
      classNames?.actionLabel,
      classNames?.actions,
      classNames?.base,
      classNames?.content,
      classNames?.leftActions,
      classNames?.rightActions,
      slots,
    ],
  );

  const contentStyle = React.useMemo<React.CSSProperties>(
    () => ({
      transform: `translate3d(${offset}px, 0, 0)`,
      transitionDuration: isDragging ? '0ms' : '220ms',
    }),
    [isDragging, offset],
  );

  const renderActionGroup = React.useCallback(
    (direction: SwipeSide) => {
      const isLeft = direction === 'left';
      const actions = isLeft ? leftActions : rightActions;

      if (actions.length === 0) {
        return null;
      }

      const groupClassName = isLeft
        ? `${classes.actions} ${classes.leftActions}`
        : `${classes.actions} ${classes.rightActions}`;

      return (
        <div
          className={groupClassName}
          style={{ width: actions.length * actionWidth }}
        >
          {actions.map((item, index) => (
            <Button
              key={`${direction}-${item.key}`}
              className={`${classes.action} ${classes.actionButton} ${item.className ?? ''}`}
              style={{ width: actionWidth }}
              color={item.color ?? color}
              size={size}
              radius="none"
              variant="solid"
              isDisabled={isDisabled || item.isDisabled}
              onTap={(event) => {
                if (isDisabled || item.isDisabled) {
                  return;
                }

                onAction?.({
                  key: item.key,
                  direction,
                  index,
                  item,
                  event:
                    event as unknown as React.MouseEvent<HTMLButtonElement>,
                });

                setDirection('none');
              }}
            >
              <span className={classes.actionLabel}>{item.label}</span>
            </Button>
          ))}
        </div>
      );
    },
    [
      actionWidth,
      classes.action,
      classes.actionLabel,
      classes.actions,
      classes.leftActions,
      classes.rightActions,
      color,
      isDisabled,
      leftActions,
      onAction,
      rightActions,
      setDirection,
      size,
    ],
  );

  return (
    <div ref={ref} className={classes.base} style={style} {...rest}>
      {renderActionGroup('left')}
      {renderActionGroup('right')}

      <div
        className={classes.content}
        style={contentStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {children}
      </div>
    </div>
  );
});

SwipeAction.displayName = 'Srcube.SwipeAction';
