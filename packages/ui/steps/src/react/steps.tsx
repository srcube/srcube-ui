import * as React from 'react';
import type { StepStatus } from '../style';
import { stepsStyle } from '../style';
import type { StepsItem, StepsReactProps } from './props';

function resolveStatus(item: StepsItem, index: number, current: number): StepStatus {
  if (item.status) {
    return item.status;
  }

  if (index < current) {
    return 'finish';
  }

  if (index === current) {
    return 'process';
  }

  return 'wait';
}

function resolveIcon(item: StepsItem, status: StepStatus, index: number) {
  if (item.icon !== undefined && item.icon !== null) {
    return item.icon;
  }

  if (status === 'finish') {
    return '✓';
  }

  if (status === 'error') {
    return '!';
  }

  return index + 1;
}

export const Steps = React.forwardRef<HTMLDivElement, StepsReactProps>(
  (props, ref) => {
    const {
      items = [],
      current = 0,
      direction,
      size,
      isDot = false,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const rootSlots = React.useMemo(
      () =>
        stepsStyle({
          direction,
          size,
          isDot,
        }),
      [direction, isDot, size],
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
            const status = resolveStatus(item, index, current);
            const slots = stepsStyle({
              direction,
              size,
              isDot,
              status,
              isLast: index === items.length - 1,
            });

            return (
              <li
                key={item.key ?? index}
                className={slots.item({ class: classNames?.item })}
              >
                <div
                  className={slots.indicatorWrap({
                    class: classNames?.indicatorWrap,
                  })}
                >
                  <span
                    className={slots.indicator({ class: classNames?.indicator })}
                  >
                    {isDot ? null : resolveIcon(item, status, index)}
                  </span>
                  <span className={slots.line({ class: classNames?.line })} />
                </div>

                <div className={slots.content({ class: classNames?.content })}>
                  <div className={slots.title({ class: classNames?.title })}>
                    {item.title}
                  </div>
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

Steps.displayName = 'Srcube.Steps';
