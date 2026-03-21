import * as React from "react";
import type { StepStatus } from '@srcube-ui/styles/components/steps';
import { stepsStyle } from '@srcube-ui/styles/components/steps';
import type { StepsItem, StepsReactProps } from "./props";

function resolveStatus(
  item: StepsItem,
  index: number,
  current: number,
): StepStatus {
  if (item.status) {
    return item.status;
  }

  if (index < current) {
    return "finish";
  }

  if (index === current) {
    return "process";
  }

  return "wait";
}

export const Steps = React.forwardRef<HTMLDivElement, StepsReactProps>(
  (props, ref) => {
    const {
      items = [],
      current = 0,
      orientation,
      size,
      color,
      tone,
      variant,
      isDot = false,
      className,
      classNames,
      style,
      ...rest
    } = props;
    const resolvedOrientation = orientation;

    const rootSlots = React.useMemo(
      () =>
        stepsStyle({
          orientation: resolvedOrientation,
          size,
          color,
          tone,
          variant,
          isDot,
        }),
      [color, isDot, resolvedOrientation, size, tone, variant],
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
            const indicatorNumber = index + 1;
            const hasDescription =
              item.description !== undefined &&
              item.description !== null &&
              item.description !== "";
            const placeholderText = "placeholder";
            const slots = stepsStyle({
              orientation: resolvedOrientation,
              size,
              color,
              tone,
              variant,
              isDot,
              status,
              isLast: index === items.length - 1,
              isFirst: index === 0,
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
                    className={slots.lineStart({
                      class: [classNames?.line, classNames?.lineStart],
                    })}
                  />
                  <span
                    className={slots.indicator({
                      class: classNames?.indicator,
                    })}
                  >
                    {isDot ? null : item.icon !== undefined &&
                      item.icon !== null ? (
                      <span
                        className={slots.indicatorText({
                          class: classNames?.indicatorText,
                        })}
                      >
                        {item.icon}
                      </span>
                    ) : status === "finish" || status === "error" ? (
                      <span
                        aria-hidden
                        className={slots.indicatorIcon({
                          class: classNames?.indicatorIcon,
                        })}
                      />
                    ) : (
                      <span
                        className={slots.indicatorText({
                          class: classNames?.indicatorText,
                        })}
                      >
                        {indicatorNumber}
                      </span>
                    )}
                  </span>
                  <span
                    className={slots.lineEnd({
                      class: [classNames?.line, classNames?.lineEnd],
                    })}
                  />
                </div>

                <div className={slots.content({ class: classNames?.content })}>
                  <div
                    aria-hidden
                    className={slots.titleSpacer({
                      class: classNames?.titleSpacer,
                    })}
                  >
                    {hasDescription ? item.description : placeholderText}
                  </div>
                  <div className={slots.title({ class: classNames?.title })}>
                    {item.title}
                  </div>
                  {hasDescription ? (
                    <div
                      className={slots.description({
                        class: classNames?.description,
                      })}
                    >
                      {item.description}
                    </div>
                  ) : (
                    <div
                      aria-hidden
                      className={slots.titleSpacer({
                        class: classNames?.titleSpacer,
                      })}
                    >
                      {placeholderText}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

Steps.displayName = "Srcube.Steps";
