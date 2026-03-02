import * as React from 'react';
import { createPortal } from 'react-dom';
import { subscribeToasts, closeToast } from '../registry';
import { toasterStyle, toastStyle } from '../style';
import type { ToastItem } from '../types';
import type { ToasterReactProps } from './props';

function normalizeMax(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(value);
}

function getVisibleToasts(
  toasts: Omit<ToastItem, 'onClose'>[],
  maxCount: number,
) {
  if (!Number.isFinite(maxCount)) {
    return toasts;
  }

  // Overflow strategy: keep the latest `max` items and drop older ones.
  // This is stable and predictable as new toasts always replace from the oldest side.
  return toasts.slice(-maxCount);
}

function getLayerStyle(
  index: number,
  total: number,
): {
  depthFromTop: number;
  style: React.CSSProperties;
} {
  const depthFromTop = total - 1 - index;
  const scale = Math.max(0.82, 1 - depthFromTop * 0.06);
  const translateY = -depthFromTop * 10;
  const opacity = Math.max(0.5, 1 - depthFromTop * 0.16);

  return {
    depthFromTop,
    style: {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity,
      zIndex: total - depthFromTop,
      pointerEvents: depthFromTop === 0 ? 'auto' : 'none',
    },
  };
}

export const Toaster = React.forwardRef<HTMLDivElement, ToasterReactProps>(
  (props, ref) => {
    const { max = 1, className, classNames, style, ...rest } = props;

    const [toasts, setToasts] = React.useState<Omit<ToastItem, 'onClose'>[]>([]);
    const maxCount = React.useMemo(() => normalizeMax(max), [max]);

    React.useEffect(() => {
      return subscribeToasts((nextItems) => {
        setToasts(nextItems);
      });
    }, []);

    const visibleToasts = React.useMemo(() => {
      return getVisibleToasts(toasts, maxCount);
    }, [maxCount, toasts]);

    const slots = React.useMemo(() => toasterStyle(), []);

    if (visibleToasts.length === 0 || typeof document === 'undefined') {
      return null;
    }

    return createPortal(
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={slots.stack({ class: classNames?.stack })}>
          {visibleToasts.map((item, index) => {
            const toastSlots = toastStyle({
              tone: item.tone,
              state: item.state,
            });
            const layer = getLayerStyle(index, visibleToasts.length);

            return (
              <div
                key={item.id}
                className={toastSlots.layer({ class: classNames?.layer })}
                style={layer.style}
                data-toast-layer={layer.depthFromTop}
              >
                <div className={toastSlots.toast({ class: classNames?.toast })}>
                  <span className={toastSlots.icon({ class: classNames?.icon })}>
                    {item.icon ? (
                      <span>{item.icon}</span>
                    ) : (
                      <span className={toastSlots._iIcon()} />
                    )}
                  </span>

                  <div className={toastSlots.textWrap({ class: classNames?.textWrap })}>
                    {item.title ? (
                      <div className={toastSlots.title({ class: classNames?.title })}>
                        {item.title}
                      </div>
                    ) : null}

                    {item.description ? (
                      <div
                        className={toastSlots.description({
                          class: classNames?.description,
                        })}
                      >
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                </div>

                {item.isClosable ? (
                  <button
                    type="button"
                    className={toastSlots.closeButton({
                      class: classNames?.closeButton,
                    })}
                    onClick={() => {
                      closeToast(item.id);
                    }}
                    aria-label="close toast"
                  >
                    <span className={toastSlots._iClose()} />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>,
      document.body,
    );
  },
);

Toaster.displayName = 'Srcube.Toaster';
