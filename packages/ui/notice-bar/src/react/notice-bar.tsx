import * as React from 'react';
import { noticeBar } from '../style';
import type { NoticeBarReactProps } from './props';

const DEFAULT_SWITCH_INTERVAL = 3000;
const DEFAULT_SWITCH_DURATION = 280;
const DEFAULT_MARQUEE_DURATION = 6000;

function resolveNoticeItems(items?: string[]) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0);
}

function normalizeDuration(
  value: number | undefined,
  fallback: number,
  minimum: number,
) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.round(value));
}

export const NoticeBar = React.forwardRef<HTMLDivElement, NoticeBarReactProps>(
  (props, ref) => {
    const {
      text,
      items,
      icon,
      action,
      isClosable = false,
      isAutoPlay = false,
      isMarquee = false,
      switchInterval = DEFAULT_SWITCH_INTERVAL,
      switchDuration = DEFAULT_SWITCH_DURATION,
      marqueeDuration = DEFAULT_MARQUEE_DURATION,
      isVisible,
      defaultVisible = true,
      color,
      size,
      className,
      classNames,
      style,
      onClose,
      onVisibleChange,
      children,
      ...rest
    } = props;

    const isControlled = isVisible !== null && isVisible !== undefined;
    const [innerVisible, setInnerVisible] = React.useState(Boolean(defaultVisible));
    const visible = isControlled ? Boolean(isVisible) : innerVisible;

    const resolvedItems = React.useMemo(() => resolveNoticeItems(items), [items]);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      if (resolvedItems.length <= 0) {
        setCurrentIndex(0);
        return;
      }

      setCurrentIndex((prevIndex) => {
        if (prevIndex < resolvedItems.length) {
          return prevIndex;
        }
        return 0;
      });
    }, [resolvedItems]);

    const hasAutoSwitching = Boolean(isAutoPlay && resolvedItems.length > 1);

    React.useEffect(() => {
      if (!visible || !hasAutoSwitching) {
        return undefined;
      }

      const safeInterval = normalizeDuration(
        switchInterval,
        DEFAULT_SWITCH_INTERVAL,
        1000,
      );
      const timer = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % resolvedItems.length);
      }, safeInterval);

      return () => {
        window.clearInterval(timer);
      };
    }, [hasAutoSwitching, resolvedItems.length, switchInterval, visible]);

    const slots = React.useMemo(
      () =>
        noticeBar({
          color,
          size,
        }),
      [color, size],
    );

    const setVisible = React.useCallback(
      (nextVisible: boolean) => {
        if (!isControlled) {
          setInnerVisible(nextVisible);
        }
        onVisibleChange?.(nextVisible);
      },
      [isControlled, onVisibleChange],
    );

    const handleClose = React.useCallback(() => {
      setVisible(false);
      onClose?.();
    }, [onClose, setVisible]);

    const activeText =
      resolvedItems.length > 0
        ? resolvedItems[currentIndex] ?? resolvedItems[0]
        : (children ?? text);
    const shouldMarquee = Boolean(isMarquee);

    const lineStyle = React.useMemo(
      () =>
        hasAutoSwitching
          ? ({
              animationDuration: `${normalizeDuration(
                switchDuration,
                DEFAULT_SWITCH_DURATION,
                120,
              )}ms`,
            } satisfies React.CSSProperties)
          : undefined,
      [hasAutoSwitching, switchDuration],
    );
    const textStyle = React.useMemo(
      () =>
        shouldMarquee
          ? ({
              animationDuration: `${normalizeDuration(
                marqueeDuration,
                DEFAULT_MARQUEE_DURATION,
                1500,
              )}ms`,
            } satisfies React.CSSProperties)
          : undefined,
      [marqueeDuration, shouldMarquee],
    );

    if (!visible) {
      return null;
    }

    const lineAnimatedClass = hasAutoSwitching
      ? slots.lineAnimated({ class: classNames?.lineAnimated })
      : '';
    const textMarqueeClass = shouldMarquee
      ? slots.textMarquee({ class: classNames?.textMarquee })
      : '';

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        {icon ? <span className={slots.icon({ class: classNames?.icon })}>{icon}</span> : null}
        <div className={slots.content({ class: classNames?.content })}>
          <div className={slots.ticker({ class: classNames?.ticker })}>
            <div
              key={hasAutoSwitching ? `notice-line-${currentIndex}` : 'notice-line-static'}
              className={slots.line({ class: [classNames?.line, lineAnimatedClass] })}
              style={lineStyle}
            >
              <div
                className={slots.text({ class: [classNames?.text, textMarqueeClass] })}
                style={textStyle}
              >
                {activeText}
              </div>
            </div>
          </div>
        </div>
        {action ? <div className={slots.action({ class: classNames?.action })}>{action}</div> : null}
        {isClosable ? (
          <button
            type="button"
            className={slots.close({ class: classNames?.close })}
            onClick={handleClose}
            aria-label="Close"
          >
            <span
              aria-hidden
              className={slots.closeIcon({ class: classNames?.closeIcon })}
            />
          </button>
        ) : null}
      </div>
    );
  },
);

NoticeBar.displayName = 'Srcube.NoticeBar';
