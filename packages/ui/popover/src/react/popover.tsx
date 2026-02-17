import * as React from 'react';
import { popover } from '../style';
import type { PopoverReactProps } from './props';

export const Popover = React.forwardRef<HTMLDivElement, PopoverReactProps>(
  (props, ref) => {
    const {
      trigger,
      title,
      content,
      isOpen,
      defaultOpen = false,
      isDisabled = false,
      shouldCloseOnOutsidePress = true,
      placement,
      size,
      hasArrow,
      className,
      classNames,
      style,
      onOpenChange,
      ...rest
    } = props;

    const isControlled = isOpen !== null && isOpen !== undefined;
    const [innerOpen, setInnerOpen] = React.useState(Boolean(defaultOpen));
    const open = isControlled ? Boolean(isOpen) : innerOpen;
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const slots = React.useMemo(
      () =>
        popover({
          placement,
          size,
          hasArrow,
        }),
      [hasArrow, placement, size],
    );

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setInnerOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    React.useEffect(() => {
      if (!open || !shouldCloseOnOutsidePress) {
        return;
      }

      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (!target || !rootRef.current) {
          return;
        }

        if (!rootRef.current.contains(target)) {
          setOpen(false);
        }
      };

      document.addEventListener('pointerdown', handlePointerDown);
      return () => {
        document.removeEventListener('pointerdown', handlePointerDown);
      };
    }, [open, setOpen, shouldCloseOnOutsidePress]);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <span
          className={slots.trigger({ class: classNames?.trigger })}
          onClick={() => {
            if (isDisabled) {
              return;
            }
            setOpen(!open);
          }}
          onKeyDown={(event) => {
            if (isDisabled) {
              return;
            }
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen(!open);
            }
          }}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-expanded={open}
          aria-disabled={isDisabled ? true : undefined}
        >
          {trigger}
        </span>

        {open ? (
          <>
            <div className={slots.layer({ class: classNames?.layer })}>
              <div className={slots.content({ class: classNames?.content })}>
                {title ? <div className={slots.title({ class: classNames?.title })}>{title}</div> : null}
                {content ? (
                  <div className={slots.description({ class: classNames?.description })}>
                    {content}
                  </div>
                ) : null}
              </div>
              {hasArrow !== false ? (
                <span className={slots.arrow({ class: classNames?.arrow })} aria-hidden="true" />
              ) : null}
            </div>
            {shouldCloseOnOutsidePress ? (
              <div className={slots.backdrop({ class: classNames?.backdrop })} />
            ) : null}
          </>
        ) : null}
      </div>
    );
  },
);

Popover.displayName = 'Srcube.Popover';
