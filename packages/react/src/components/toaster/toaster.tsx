import * as React from 'react';
import { createPortal } from 'react-dom';
import { subscribeToasts, closeToast } from './registry';
import { toasterStyle, toastStyle } from '@srcube-ui/styles/components/toaster';
import type { ToastItem } from './types';
import type { ToasterReactProps } from './props';

const MAX_VISIBLE_LAYERS = 3;

function getVisibleToasts(toasts: Omit<ToastItem, 'onClose'>[]) {
  return toasts.slice(-MAX_VISIBLE_LAYERS);
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
  const translateY = depthFromTop * 10;
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
    const { className, classNames, style, ...rest } = props;

    const [toasts, setToasts] = React.useState<Omit<ToastItem, 'onClose'>[]>([]);

    React.useEffect(() => {
      return subscribeToasts((nextItems) => {
        setToasts(nextItems);
      });
    }, []);

    const visibleToasts = React.useMemo(() => {
      return getVisibleToasts(toasts);
    }, [toasts]);

    const slots = React.useMemo(() => toasterStyle(), []);

    const renderedToasts = React.useMemo(() => {
      return visibleToasts.map((item, index) => {
        const toastSlots = toastStyle({
          color: item.color,
          tone: item.tone,
          state: item.state,
        });

        return {
          item,
          toastSlots,
          layer: getLayerStyle(index, visibleToasts.length),
        };
      });
    }, [visibleToasts]);

    const activeToast = renderedToasts[renderedToasts.length - 1];
    const shouldRenderCloseButton = activeToast?.item.showClose === true;

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
          {renderedToasts.map(({ item, layer, toastSlots }) => {
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
              </div>
            );
          })}

          {shouldRenderCloseButton ? (
            <div className={slots.closeLayer({ class: classNames?.closeLayer })}>
              <button
                type="button"
                className={activeToast.toastSlots.closeButton({
                  class: classNames?.closeButton,
                })}
                onClick={() => {
                  closeToast(activeToast.item.id);
                }}
                aria-label="close toast"
              >
                <span className={activeToast.toastSlots._iClose()} />
              </button>
            </div>
          ) : null}
        </div>
      </div>,
      document.body,
    );
  },
);

Toaster.displayName = 'Srcube.Toaster';
