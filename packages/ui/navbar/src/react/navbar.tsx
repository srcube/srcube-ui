import * as React from 'react';
import { navbar } from '../style';
import type { NavbarReactProps } from './props';

export const Navbar = React.forwardRef<HTMLDivElement, NavbarReactProps>(
  (props, ref) => {
    const {
      title,
      startContent,
      endContent,
      size,
      isBordered,
      hasSafeTop,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const slots = React.useMemo(
      () =>
        navbar({
          size,
          isBordered,
          hasSafeTop,
        }),
      [hasSafeTop, isBordered, size],
    );

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={slots.inner({ class: classNames?.inner })}>
          <div className={slots.start({ class: classNames?.start })}>{startContent}</div>
          <div className={slots.title({ class: classNames?.title })}>{title}</div>
          <div className={slots.end({ class: classNames?.end })}>{endContent}</div>
        </div>
      </div>
    );
  },
);

Navbar.displayName = 'Srcube.Navbar';
