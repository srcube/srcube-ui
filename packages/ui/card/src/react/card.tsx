import * as React from 'react';
import { card } from '../style';
import type { CardReactProps } from './props';

export const Card = React.forwardRef<HTMLDivElement, CardReactProps>(
  (props, ref) => {
    const {
      title,
      description,
      startContent,
      endContent,
      header,
      footer,
      isHeaderDivider = false,
      isFooterDivider = false,
      size,
      radius,
      shadow,
      isBordered,
      className,
      classNames,
      style,
      children,
      ...rest
    } = props;

    const slots = React.useMemo(
      () =>
        card({
          size,
          radius,
          shadow,
          isBordered,
        }),
      [isBordered, radius, shadow, size],
    );

    const hasDefaultHeader = Boolean(
      title !== undefined || description !== undefined || startContent || endContent,
    );
    const hasHeader = Boolean(header !== undefined || hasDefaultHeader);
    const hasFooter = footer !== undefined && footer !== null;

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        {hasHeader ? (
          <div className={slots.header({ class: classNames?.header })}>
            {header !== undefined && header !== null ? (
              header
            ) : (
              <>
                {startContent ? (
                  <div className={slots.startContent({ class: classNames?.startContent })}>
                    {startContent}
                  </div>
                ) : null}

                <div className={slots.headerMain({ class: classNames?.headerMain })}>
                  {title !== undefined && title !== null ? (
                    <div className={slots.title({ class: classNames?.title })}>{title}</div>
                  ) : null}
                  {description !== undefined && description !== null ? (
                    <div className={slots.description({ class: classNames?.description })}>
                      {description}
                    </div>
                  ) : null}
                </div>

                {endContent ? (
                  <div className={slots.endContent({ class: classNames?.endContent })}>
                    {endContent}
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {hasHeader && isHeaderDivider ? (
          <div className={slots.divider({ class: classNames?.divider })} />
        ) : null}

        <div className={slots.body({ class: classNames?.body })}>{children}</div>

        {hasFooter && isFooterDivider ? (
          <div className={slots.divider({ class: classNames?.divider })} />
        ) : null}

        {hasFooter ? (
          <div className={slots.footer({ class: classNames?.footer })}>{footer}</div>
        ) : null}
      </div>
    );
  },
);

Card.displayName = 'Srcube.Card';
