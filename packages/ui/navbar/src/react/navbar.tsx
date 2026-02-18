import * as React from 'react';
import { navbar } from '../style';
import type { NavbarReactProps } from './props';

export const Navbar = React.forwardRef<HTMLDivElement, NavbarReactProps>(
  (props, ref) => {
    const {
      title,
      withBack = false,
      startContent,
      endContent,
      size,
      isBordered,
      hasSafeTop,
      titleAlign,
      className,
      classNames,
      style,
      onBack,
      ...rest
    } = props;

    const slots = React.useMemo(
      () =>
        navbar({
          size,
          isBordered,
          hasSafeTop,
          titleAlign,
        }),
      [hasSafeTop, isBordered, size, titleAlign],
    );

    const handleBackClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onBack?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (typeof window === 'undefined') {
          return;
        }

        if (window.history.length > 1) {
          window.history.back();
        }
      },
      [onBack],
    );

    const resolvedStartContent = React.useMemo(() => {
      if (startContent !== null && startContent !== undefined) {
        return startContent;
      }

      if (!withBack) {
        return null;
      }

      return (
        <button
          type="button"
          aria-label="Back"
          className={slots.back({ class: classNames?.back })}
          onClick={handleBackClick}
        >
          <span
            aria-hidden
            className={slots.backIcon({ class: classNames?.backIcon })}
          />
        </button>
      );
    }, [
      classNames?.back,
      classNames?.backIcon,
      handleBackClick,
      slots,
      startContent,
      withBack,
    ]);

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={slots.inner({ class: classNames?.inner })}>
          <div className={slots.start({ class: classNames?.start })}>
            {resolvedStartContent}
          </div>
          <div className={slots.title({ class: classNames?.title })}>{title}</div>
          <div className={slots.end({ class: classNames?.end })}>{endContent}</div>
        </div>
      </div>
    );
  },
);

Navbar.displayName = 'Srcube.Navbar';
