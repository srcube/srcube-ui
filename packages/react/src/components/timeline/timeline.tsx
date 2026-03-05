import * as React from 'react';
import { timelineStyle } from '@srcube-ui/styles/components/timeline';
import type { TimelineReactProps } from './props';

export const Timeline = React.forwardRef<HTMLDivElement, TimelineReactProps>(
  (props, ref) => {
    const {
      items = [],
      size,
      color = 'default',
      lineStyle,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const rootSlots = React.useMemo(
      () =>
        timelineStyle({
          size,
          color,
          lineStyle,
        }),
      [color, lineStyle, size],
    );

    return (
      <div
        ref={ref}
        className={rootSlots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <ol className={rootSlots.list({ class: classNames?.list })}>
          {items.map((item, index) => {
            const slots = timelineStyle({
              size,
              color: item.color ?? color,
              lineStyle,
              isPending: Boolean(item.isPending),
              isLast: index === items.length - 1,
              isFirst: index === 0,
            });

            return (
              <li
                key={item.key ?? index}
                className={slots.item({ class: classNames?.item })}
              >
                <div className={slots.head({ class: classNames?.head })}>
                  <span className={slots.node({ class: classNames?.node })}>
                    {item.icon !== undefined && item.icon !== null ? (
                      <span className={slots.icon({ class: classNames?.icon })}>
                        {item.icon}
                      </span>
                    ) : null}
                  </span>
                  <span className={slots.line({ class: classNames?.line })} />
                </div>

                <div className={slots.content({ class: classNames?.content })}>
                  <div className={slots.title({ class: classNames?.title })}>
                    {item.title}
                  </div>
                  {item.time ? (
                    <div className={slots.time({ class: classNames?.time })}>
                      {item.time}
                    </div>
                  ) : null}
                  {item.description ? (
                    <div
                      className={slots.description({ class: classNames?.description })}
                    >
                      {item.description}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

Timeline.displayName = 'Srcube.Timeline';
