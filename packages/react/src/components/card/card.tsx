import * as React from 'react';
import { card } from '@srcube-ui/styles/components/card';
import type { CardReactProps } from './props';

export const Card = React.forwardRef<HTMLDivElement, CardReactProps>(
  (props, ref) => {
    const {
      header,
      body,
      footer,
      color,
      tone,
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
          tone,
          size,
          radius,
        }),
      [color, radius, size, tone],
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
