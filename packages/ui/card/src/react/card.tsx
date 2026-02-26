import * as React from 'react';
import { card } from '../style';
import type { CardReactProps } from './props';

export const Card = React.forwardRef<HTMLDivElement, CardReactProps>(
  (props, ref) => {
    const {
      header,
      body,
      footer,
      color,
      size,
      radius,
      className,
      classNames,
      style,
      children,
      ...rest
    } = props;

    const slots = React.useMemo(
      () =>
        card({
          color,
          size,
          radius,
        }),
      [color, radius, size],
    );

    const hasHeader = header !== undefined && header !== null;
    const resolvedBody = body ?? children;
    const hasBody = resolvedBody !== undefined && resolvedBody !== null;
    const hasFooter = footer !== undefined && footer !== null;

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        {hasHeader ? (
          <div className={slots.header({ class: classNames?.header })}>{header}</div>
        ) : null}

        {hasBody ? (
          <div className={slots.body({ class: classNames?.body })}>{resolvedBody}</div>
        ) : null}

        {hasFooter ? (
          <div className={slots.footer({ class: classNames?.footer })}>{footer}</div>
        ) : null}
      </div>
    );
  },
);

Card.displayName = 'Srcube.Card';
